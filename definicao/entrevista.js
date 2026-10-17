/* Advogado Já · Entrevista dinâmica V1
   Contrato: a navegação NÃO possui nomes de áreas fixos; usa somente data/estrutura.json.
   Alterações no navegador ficam em memória e rascunho local até exportação + commit.
*/
(() => {
  'use strict';
  const PATHS = {
    estrutura: 'data/estrutura.json',
    perguntas: 'data/perguntas.json',
    respostas: 'data/respostas.json'
  };
  const SCHEMAS = {
    estrutura: 'advogadoja.entrevista.estrutura.v1',
    perguntas: 'advogadoja.entrevista.perguntas.v1',
    respostas: 'advogadoja.entrevista.respostas.v1',
    snapshot: 'advogadoja.entrevista.snapshot.v1'
  };
  const DRAFT_KEY = 'advogadoja.entrevista.dinamica.rascunho.v1';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy = obj => JSON.parse(JSON.stringify(obj));
  const state = {data: null, original: null, area: null, selected: null, filter: 'todas', search: '', dirty: new Set(), localDraft: null};
  let savingTimer;

  function fail(message) {throw new Error(message);}
  function status(message, mode = '') {const node = $('status');node.textContent = message;node.className = 'status-line ' + mode;}
  function roots() {return ordered(state.data.estrutura.areas.filter(a => a.parent_id == null));}
  function ordered(list) {return [...list].sort((a,b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0) || a.id.localeCompare(b.id));}
  function byId() {return new Map(state.data.estrutura.areas.map(a => [a.id,a]));}
  function descendants(id, includeSelf = true) {
    const seen = new Set(), stack = [id];
    const areas = state.data.estrutura.areas;
    while (stack.length) {
      const current = stack.pop();
      if (seen.has(current)) continue;
      seen.add(current);
      for (const a of areas) if (a.parent_id === current) stack.push(a.id);
    }
    if (!includeSelf) seen.delete(id);
    return seen;
  }
  function ancestry(id) {
    const index = byId(), path = [], seen = new Set();
    let node = index.get(id);
    while (node && !seen.has(node.id)) {seen.add(node.id);path.unshift(node);node = index.get(node.parent_id);}
    return path;
  }
  function countForArea(id) {const ids = descendants(id);return state.data.perguntas.perguntas.filter(q => ids.has(q.area_id)).length;}
  function answerFor(id) {return state.data.respostas.respostas[id] || {};}
  function answered(id) {
    const a = answerFor(id);
    return Boolean((a.selected && a.selected !== 'OTHER') || (a.selected === 'OTHER' && String(a.otherText || '').trim()));
  }
  function review(id) {return answerFor(id).situacao === 'revisar';}
  function confirmed(id) {return answerFor(id).situacao === 'confirmada' && answered(id);}
  function areaIdsInFocus() {return state.selected === '__all__' ? new Set(state.data.estrutura.areas.map(a=>a.id)) : descendants(state.selected);}

  function validateStructure(s) {
    if (!s || s.schema !== SCHEMAS.estrutura || !Array.isArray(s.areas) || !s.areas.length) fail('estrutura.json: schema ou lista de áreas inválidos.');
    const map = new Map();
    for (const a of s.areas) {
      if (!a || typeof a.id !== 'string' || !a.id.trim() || !a.titulo || typeof a.titulo !== 'string') fail('estrutura.json: toda área precisa de id e titulo.');
      if (map.has(a.id)) fail('estrutura.json: ID repetido: ' + a.id);
      map.set(a.id,a);
    }
    for (const a of s.areas) {
      if (a.parent_id !== null && a.parent_id !== undefined && !map.has(a.parent_id)) fail('estrutura.json: parent_id inexistente para ' + a.id);
      let current = a, seen = new Set();
      while (current) {
        if (seen.has(current.id)) fail('estrutura.json: ciclo detectado em ' + a.id);
        seen.add(current.id);
        current = current.parent_id == null ? null : map.get(current.parent_id);
      }
    }
    if (!s.areas.some(a => a.parent_id == null)) fail('estrutura.json: é necessária ao menos uma área principal.');
  }
  function validateQuestions(q, structure) {
    if (!q || q.schema !== SCHEMAS.perguntas || !Array.isArray(q.perguntas)) fail('perguntas.json: formato inválido.');
    const areas = new Set(structure.areas.map(a => a.id)), ids = new Set();
    for (const item of q.perguntas) {
      if (!item || typeof item.id !== 'string' || !item.id.trim() || !item.text || typeof item.text !== 'string') fail('perguntas.json: ID ou texto ausente.');
      if (ids.has(item.id)) fail('perguntas.json: ID repetido: ' + item.id);
      if (!areas.has(item.area_id)) fail('perguntas.json: área desconhecida ' + item.area_id + ' (pergunta ' + item.id + ').');
      if (!Array.isArray(item.options)) fail('perguntas.json: options precisa ser lista em ' + item.id);
      const optionIds = new Set();
      for (const op of item.options) {
        if (!op || !op.id || !op.label || optionIds.has(op.id) || op.id === 'OTHER') fail('perguntas.json: alternativa inválida em ' + item.id);
        optionIds.add(op.id);
      }
      ids.add(item.id);
    }
  }
  function validateResponses(responses, q) {
    if (!responses || responses.schema !== SCHEMAS.respostas || !responses.respostas || typeof responses.respostas !== 'object' || Array.isArray(responses.respostas)) fail('respostas.json: formato inválido.');
    const ids = new Set(q.perguntas.map(x => x.id));
    for (const [id, answer] of Object.entries(responses.respostas)) {
      if (!ids.has(id)) fail('respostas.json: pergunta não encontrada: ' + id);
      if (!answer || typeof answer !== 'object' || Array.isArray(answer)) fail('respostas.json: resposta inválida para ' + id);
      if (answer.situacao && !['historica','revisar','confirmada','pendente'].includes(answer.situacao)) fail('respostas.json: situação inválida em ' + id);
    }
  }
  function validateAll(data) {
    validateStructure(data.estrutura);validateQuestions(data.perguntas, data.estrutura);validateResponses(data.respostas, data.perguntas);
  }
  async function load() {
    status('Carregando arquivos JSON do repositório…');
    try {
      const entries = await Promise.all(Object.entries(PATHS).map(async ([key,path]) => {
        const res = await fetch(path, {cache:'no-store'});
        if (!res.ok) throw new Error(path + ' retornou HTTP ' + res.status);
        return [key, await res.json()];
      }));
      state.data = Object.fromEntries(entries);
      validateAll(state.data);
      state.original = copy(state.data);
      state.area = roots()[0].id;
      state.selected = state.area;
      status('Arquivos externos carregados. Para publicar modificações, exporte os JSONs e substitua-os no repositório.', 'ok');
      try {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
          const obj = JSON.parse(draft);
          if (obj?.schema === SCHEMAS.snapshot) {validateAll(obj.data);state.localDraft = obj; $('draftNotice').hidden = false;}
        }
      } catch(err) {status('Base lida; não foi possível conferir rascunho local: ' + err.message, 'error');}
      render();
    } catch (err) {
      status('Falha ao carregar: ' + err.message + ' — execute via HTTP local/GitHub Pages ou use Importar JSON.', 'error');
      $('questions').innerHTML = `<div class="empty"><strong>Não foi possível abrir os arquivos externos.</strong>Servir com <code>python -m http.server 8000</code> na pasta do laboratório, ou importar o snapshot JSON.</div>`;
      $('mainAreas').innerHTML = '';
    }
  }
  function renderTabs() {
    const total = roots();
    $('mainAreas').innerHTML = total.map(a => `<button class="area-tab ${state.area===a.id?'active':''}" type="button" data-area="${esc(a.id)}" aria-pressed="${state.area===a.id}">${esc(a.titulo)}<span class="tab-count">${countForArea(a.id)}</span></button>`).join('');
  }
  function renderNav() {
    const root = byId().get(state.area);
    $('areaName').textContent = root?.titulo || 'Seções';
    if (!root) {$('tree').innerHTML='';return;}
    const subtree = ordered(state.data.estrutura.areas.filter(a=>descendants(root.id).has(a.id)));
    const depthFor = id => Math.max(0,ancestry(id).length - ancestry(root.id).length);
    $('tree').innerHTML = subtree.map(a => `<button type="button" class="${state.selected===a.id?'selected':''}" data-section="${esc(a.id)}" style="padding-left:${Math.min(4,depthFor(a.id))*11+8}px"><span class="tree-icon" aria-hidden="true">${a.id===root.id?'▣':'▸'}</span><span class="tree-name">${esc(a.titulo)}</span><span class="tree-count">${countForArea(a.id)}</span></button>`).join('');
  }
  function renderMetrics() {
    if (!state.data)return;
    const all = state.data.perguntas.perguntas;
    $('areasTotal').textContent = roots().length;
    $('questionsTotal').textContent = all.length;
    $('answersTotal').textContent = all.filter(q=>answered(q.id)).length;
    $('reviewsTotal').textContent = all.filter(q=>review(q.id)).length;
  }
  function filteredQuestions() {
    const visible = areaIdsInFocus();
    const term = state.search.trim().toLocaleLowerCase('pt-BR');
    const sectionMap = byId();
    return state.data.perguntas.perguntas.filter(q => {
      if (!visible.has(q.area_id)) return false;
      if (state.filter === 'pendentes' && answered(q.id)) return false;
      if (state.filter === 'respondidas' && !answered(q.id)) return false;
      if (state.filter === 'revisar' && !review(q.id)) return false;
      if (state.filter === 'confirmadas' && !confirmed(q.id)) return false;
      if (term) {
        const text = [q.id,q.text,q.secao_origem,...(q.options||[]).map(op=>op.label),...(ancestry(q.area_id).map(a=>a.titulo))].join(' ').toLocaleLowerCase('pt-BR');
        if (!text.includes(term)) return false;
      }
      return true;
    });
  }
  function questionCard(q) {
    const a = answerFor(q.id), ok=answered(q.id), rev=review(q.id);
    const chips = `<span class="q-chip ${rev?'review':confirmed(q.id)?'confirmed':''}" data-badge="${esc(q.id)}">${rev?'A REVISAR':confirmed(q.id)?'CONFIRMADA':ok?'RESPONDIDA · HISTÓRICA':'PENDENTE'}</span>`;
    const opts = (q.options || []).map(op => `<label class="option"><input type="radio" name="ans-${esc(q.id)}" data-select="${esc(q.id)}" value="${esc(op.id)}" ${a.selected===op.id?'checked':''}><span><b>${esc(op.id)}.</b> ${esc(op.label)}</span></label>`).join('');
    const other = q.allowOther !== false ? `<label class="option"><input type="radio" name="ans-${esc(q.id)}" data-select="${esc(q.id)}" value="OTHER" ${a.selected==='OTHER'?'checked':''}><span>Outra resposta / observação livre</span></label><textarea class="other-box" data-other="${esc(q.id)}" placeholder="Escreva a resposta alternativa…">${esc(a.otherText || '')}</textarea>` : '';
    return `<article class="question ${ok?'answered':''} ${rev?'revisar':''}" data-card="${esc(q.id)}"><div class="question-head"><span class="q-id">${esc(q.id)}</span>${chips}<span class="q-chip">Origem: ${esc(q.secao_origem||'-')}</span></div><h3>${esc(q.text)}</h3><div class="options">${opts}${other}</div><label class="note-heading" for="note-${esc(q.id)}">Nota / justificativa da resposta</label><textarea id="note-${esc(q.id)}" class="note-box" data-note="${esc(q.id)}" placeholder="Contexto, justificativa ou pendência…">${esc(a.note||'')}</textarea><div class="question-tools"><label>Situação <select data-situation="${esc(q.id)}"><option value="pendente" ${(!a.situacao || a.situacao==='pendente')?'selected':''}>Pendente</option><option value="historica" ${a.situacao==='historica'?'selected':''}>Resposta histórica</option><option value="revisar" ${a.situacao==='revisar'?'selected':''}>A revisar</option><option value="confirmada" ${a.situacao==='confirmada'?'selected':''}>Confirmada na entrevista</option></select></label><button class="text-button" type="button" data-clear="${esc(q.id)}">Limpar resposta</button></div></article>`;
  }
  function renderQuestions() {
    const list = filteredQuestions();
    const areas = byId(), selected=areas.get(state.selected);
    const path = selected ? ancestry(selected) : [];
    $('breadcrumb').textContent = path.map(a=>a.titulo).join('  /  ') || 'Todas as áreas';
    $('currentTitle').textContent = selected?.titulo || 'Entrevista completa';
    $('currentDesc').textContent = selected?.descricao || '';
    $('visibleCounter').textContent = `${list.length} de ${state.data.perguntas.perguntas.length} perguntas`;
    if (!list.length) { $('questions').innerHTML = '<div class="empty"><strong>Nenhuma pergunta nesta seleção.</strong>Você pode acrescentar perguntas pelo botão + Pergunta ou importando perguntas.json. Não criamos perguntas automaticamente.</div>'; return;}
    const groups = new Map();
    for (const q of list) {
      const bucket = groups.get(q.area_id) || [];
      bucket.push(q);groups.set(q.area_id,bucket);
    }
    const sections = [...groups.keys()].sort((a,b) => {
      const aa=areas.get(a),bb=areas.get(b);
      return ancestry(a).map(n=>String(n.ordem||0).padStart(4,'0')).join('.')
        .localeCompare(ancestry(b).map(n=>String(n.ordem||0).padStart(4,'0')).join('.')) || aa.titulo.localeCompare(bb.titulo);
    });
    $('questions').innerHTML = sections.map(id=>{
      const rows=groups.get(id), done=rows.filter(q=>answered(q.id)).length;
      return `<details class="group" open><summary><span class="group-name">${esc(areas.get(id)?.titulo||id)}</span><small>${done}/${rows.length} respondidas</small><span class="chevron" aria-hidden="true">›</span></summary><div class="group-cards">${rows.map(questionCard).join('')}</div></details>`;
    }).join('');
  }
  function render() {
    if (!state.data)return;
    if (!byId().has(state.area)) state.area=roots()[0].id;
    if (!byId().has(state.selected)) state.selected=state.area;
    renderTabs();renderNav();renderMetrics();renderQuestions();
    $('filter').value=state.filter;
  }
  function saveDraft() {
    if (!state.data)return;
    try {
      localStorage.setItem(DRAFT_KEY,JSON.stringify({schema:SCHEMAS.snapshot, data:state.data, savedAt:new Date().toISOString()}));
      status('Rascunho salvo neste navegador. Exporte os arquivos JSON para atualizar o repositório.','ok');
    }catch(err){status('Não foi possível salvar rascunho local: '+err.message,'error');}
  }
  function markDirty(part) {state.dirty.add(part);clearTimeout(savingTimer);savingTimer=setTimeout(saveDraft,250);}
  function ensureAnswer(id) {
    return state.data.respostas.respostas[id] ||= {selected:'',otherText:'',note:'',answered:false,situacao:'pendente'};
  }
  function cardStatus(id) {
    const card=[...document.querySelectorAll('[data-card]')].find(x=>x.dataset.card===id);
    if (!card) return;
    const a=answerFor(id),ok=answered(id),rev=review(id),conf=confirmed(id);
    card.classList.toggle('answered',ok);card.classList.toggle('revisar',rev);
    const badge=card.querySelector('[data-badge]');
    if (badge) {badge.textContent=rev?'A REVISAR':conf?'CONFIRMADA':ok?'RESPONDIDA · HISTÓRICA':'PENDENTE';badge.className='q-chip '+(rev?'review':conf?'confirmed':'');}
    renderMetrics();
  }
  function download(name,data) {
    const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  }
  function exportKind(kind) {
    if (!state.data) {status('Importe os JSONs antes de exportar.','error');return;}
    if (kind==='snapshot') download('entrevista_snapshot.json',{schema:SCHEMAS.snapshot,versao:1,data:state.data,exportadoEm:new Date().toISOString()});
    else if (PATHS[kind]) download(kind+'.json',state.data[kind]);
    status('Exportação iniciada. Substitua o(s) arquivo(s) correspondente(s) no repositório para publicar.','ok');
    const menu=document.querySelector('.export-menu');if(menu)menu.open=false;
  }
  function mergeLegacy(original) {
    // Compatibilidade com o modelo anterior; mantém área atribuída aos IDs já conhecidos.
    if (!Array.isArray(original.questions))fail('Questionário anterior inválido: questions ausente.');
    const known = new Map(state.data.perguntas.perguntas.map(q=>[q.id,q]));
    const target = state.selected === '__all__' ? roots()[0].id : state.selected;
    for (const q of original.questions) {
      if (!q.id || !q.text)fail('Questionário anterior contém pergunta sem ID/texto.');
      if (!known.has(q.id)) {
        const entry={id:q.id,area_id:target,secao_origem:q.sectionId||'legado',text:q.text,options:q.options||[],allowOther:q.allowOther!==false,source:q.source||'importacao'};
        state.data.perguntas.perguntas.push(entry);known.set(q.id,entry);
      }
      if (q.answer && typeof q.answer==='object') state.data.respostas.respostas[q.id]={...q.answer,situacao:'revisar',origem:'Importação de questionário legado; requer conferência'};
    }
    state.dirty.add('perguntas');state.dirty.add('respostas');
  }
  function importData(json) {
    if (json.schema===SCHEMAS.snapshot) {
      validateAll(json.data);state.data=copy(json.data);state.dirty=new Set(['estrutura','perguntas','respostas']);
    } else if (json.schema===SCHEMAS.estrutura) {
      validateStructure(json);
      validateQuestions(state.data.perguntas,json);
      state.data.estrutura=copy(json);state.dirty.add('estrutura');
    } else if (json.schema===SCHEMAS.perguntas) {
      validateQuestions(json,state.data.estrutura);
      // Ninguém pode perder perguntas existentes inadvertidamente: só permitir adição/alteração mantendo IDs.
      const oldIds=new Set(state.data.perguntas.perguntas.map(q=>q.id));
      const newIds=new Set(json.perguntas.map(q=>q.id));
      for (const id of oldIds) if (!newIds.has(id))fail('Importação recusada: pergunta existente '+id+' desapareceria. Preserve-a ou faça uma migração explícita.');
      state.data.perguntas=copy(json);state.dirty.add('perguntas');
    } else if (json.schema===SCHEMAS.respostas) {
      validateResponses(json,state.data.perguntas);
      state.data.respostas.respostas={...state.data.respostas.respostas,...copy(json.respostas)};
      state.dirty.add('respostas');
    } else if (json.schema==='advogadoja.questionnaire.v1') {
      mergeLegacy(json);
    } else fail('Schema não reconhecido. Importe estrutura, perguntas, respostas ou snapshot compatíveis.');
    validateAll(state.data);
  }
  async function onImport(files) {
    if (!files.length)return;
    if (!state.data) {
      const objects = await Promise.all(files.map(async f=>JSON.parse(await f.text())));
      const data={};
      for (const obj of objects) {
        if (obj.schema===SCHEMAS.snapshot) Object.assign(data,obj.data);
        else for(const key of Object.keys(PATHS)) if (obj.schema===SCHEMAS[key])data[key]=obj;
      }
      if (!data.estrutura || !data.perguntas || !data.respostas)fail('Com carregamento automático indisponível, importe os três JSONs juntos ou um snapshot completo.');
      validateAll(data);
      state.data=copy(data);state.original=copy(data);state.area=roots()[0].id;state.selected=state.area;
    } else {
      const temp=copy(state.data),tempDirty=new Set(state.dirty);
      try{for (const f of files)importData(JSON.parse(await f.text()));}
      catch(error){state.data=temp;state.dirty=tempDirty;throw error;}
    }
    markDirty('respostas');render();status('Importação validada. Para publicar, exporte os JSONs alterados.','ok');
  }
  function addArea() {
    if (!state.data)return;
    const title=prompt('Título da nova área/subárea:');if (!title?.trim())return;
    const defaultParent=state.selected==='__all__'?'':state.selected;
    const p=prompt('ID da área pai (deixe vazio para aba principal):',defaultParent);
    if (p===null)return;
    const parent=p.trim()||null,index=byId();
    if (parent && !index.has(parent)){alert('Área pai inexistente: '+parent);return;}
    const slug=title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')||'nova_area';
    const prefix=parent?parent+'.':'';let id=prefix+slug,n=2;
    while(index.has(id))id=prefix+slug+'_'+n++;
    const peers=state.data.estrutura.areas.filter(a=>(a.parent_id||null)===parent);
    const order=Math.max(0,...peers.map(a=>Number(a.ordem)||0))+10;
    state.data.estrutura.areas.push({id,parent_id:parent,titulo:title.trim(),ordem:order,descricao:''});
    state.area=ancestry(id)[0].id;state.selected=id;
    markDirty('estrutura');render();status('Área '+id+' criada em memória. Exporte estrutura.json.','ok');
  }
  function addQuestion() {
    if (!state.data)return;
    if (state.selected==='__all__'){alert('Selecione uma área antes de adicionar perguntas.');return;}
    const title=prompt('Texto completo da pergunta:');if (!title?.trim())return;
    const labels=prompt('Alternativas separadas por | (ou deixe em branco para resposta livre):','Sim | Não');
    if(labels===null)return;
    const opts=labels.split('|').map(x=>x.trim()).filter(Boolean);
    if(opts.length>26){alert('Use até 26 alternativas.');return;}
    const used=new Set(state.data.perguntas.perguntas.map(q=>q.id));
    let n=Math.max(0,...[...used].filter(id=>/^Q\d+$/.test(id)).map(id=>Number(id.slice(1))))+1;
    let id='Q'+String(n).padStart(4,'0');while(used.has(id))id='Q'+String(++n).padStart(4,'0');
    state.data.perguntas.perguntas.push({id,area_id:state.selected,secao_origem:'nova',text:title.trim(),options:opts.map((label,i)=>({id:String.fromCharCode(65+i),label})),allowOther:true,source:'adicionada_na_entrevista'});
    state.data.respostas.respostas[id]={selected:'',otherText:'',note:'',situacao:'pendente',answered:false};
    markDirty('perguntas');render();status('Pergunta '+id+' adicionada em memória. Exporte perguntas.json e respostas.json.','ok');
  }
  function wire() {
    $('mainAreas').addEventListener('click', e=>{const b=e.target.closest('[data-area]');if(!b)return;state.area=b.dataset.area;state.selected=state.area;render();});
    $('tree').addEventListener('click', e=>{const b=e.target.closest('[data-section]');if(!b)return;state.selected=b.dataset.section;render();});
    $('allSections').addEventListener('click',()=>{state.selected=state.area;render();});
    $('search').addEventListener('input',e=>{state.search=e.target.value;renderQuestions();});
    $('filter').addEventListener('change',e=>{state.filter=e.target.value;renderQuestions();});
    $('expandAll').addEventListener('click',()=>document.querySelectorAll('details.group').forEach(d=>d.open=true));
    $('collapseAll').addEventListener('click',()=>document.querySelectorAll('details.group').forEach(d=>d.open=false));
    $('addArea').addEventListener('click',addArea);$('addQuestion').addEventListener('click',addQuestion);
    $('import').addEventListener('click',()=>$('importFile').click());
    $('importFile').addEventListener('change',async e=>{try{await onImport([...e.target.files]);}catch(err){status('Importação recusada: '+err.message,'error');alert('Importação recusada: '+err.message);}finally{e.target.value='';}});
    document.querySelector('.export-menu').addEventListener('click',e=>{const b=e.target.closest('[data-export]');if(b)exportKind(b.dataset.export);});
    $('questions').addEventListener('change',e=>{
      const radio=e.target.closest('[data-select]'),sit=e.target.closest('[data-situation]');
      if (radio) {
        const id=radio.dataset.select,a=ensureAnswer(id);a.selected=radio.value;
        if (radio.value!=='OTHER') {a.otherText='';const card=radio.closest('[data-card]');const input=card?.querySelector('[data-other]');if(input)input.value='';}
        a.answered=answered(id);a.answeredAt=a.answered?new Date().toISOString():null;
        markDirty('respostas');cardStatus(id);
      } else if(sit) {
        const id=sit.dataset.situation,a=ensureAnswer(id);
        if (sit.value==='confirmada' && !confirm('Confirma que esta resposta foi revisada e aprovada expressamente na entrevista?')) {sit.value=a.situacao||'pendente';return;}
        a.situacao=sit.value;a.atualizadoEm=new Date().toISOString();markDirty('respostas');cardStatus(id);
      }
    });
    $('questions').addEventListener('input',e=>{
      const other=e.target.closest('[data-other]'),note=e.target.closest('[data-note]');
      if (other) {
        const id=other.dataset.other,a=ensureAnswer(id);a.otherText=other.value;
        if (other.value.trim()){a.selected='OTHER';const radio=other.closest('[data-card]').querySelector('input[value="OTHER"]');if(radio)radio.checked=true;}
        a.answered=answered(id);markDirty('respostas');cardStatus(id);
      } else if(note) {const a=ensureAnswer(note.dataset.note);a.note=note.value;markDirty('respostas');}
    });
    $('questions').addEventListener('click',e=>{
      const b=e.target.closest('[data-clear]');if (!b)return;
      const id=b.dataset.clear,a=ensureAnswer(id);a.selected='';a.otherText='';a.answered=false;a.answeredAt=null;a.situacao='pendente';
      const card=b.closest('[data-card]');card.querySelectorAll('input[type=radio]').forEach(r=>r.checked=false);
      const other=card.querySelector('[data-other]');if(other)other.value='';
      const situ=card.querySelector('[data-situation]');if(situ)situ.value='pendente';
      markDirty('respostas');cardStatus(id);
    });
    $('restoreDraft').addEventListener('click',()=>{
      if (!state.localDraft)return;
      state.data=copy(state.localDraft.data);state.dirty=new Set(['estrutura','perguntas','respostas']);
      state.area=roots()[0].id;state.selected=state.area;$('draftNotice').hidden=true;render();status('Rascunho recuperado. Para publicar, exporte os JSONs.','ok');
    });
    $('ignoreDraft').addEventListener('click',()=>{$('draftNotice').hidden=true;state.localDraft=null;try{localStorage.removeItem(DRAFT_KEY);}catch{}status('Rascunho ignorado; permanecem os arquivos do repositório.');});
    window.addEventListener('beforeunload',()=>{if(savingTimer){clearTimeout(savingTimer);saveDraft();}});
  }
  wire();load();
  // Interface de inspeção para testes locais, sem alterar a fonte de verdade.
  window.AdvogadoJaEntrevista={snapshot:()=>state.data?copy(state.data):null,selecionar:(id)=>{const path=ancestry(id);if(!path.length)return false;state.area=path[0].id;state.selected=id;render();return true;},validar:()=>{if(!state.data)return false;validateAll(state.data);return true;}};
})();
