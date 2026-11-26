/* TheFounder — diagnostic public. Confirmation uniquement après persistance CRM. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const steps = ['Entreprise','Départements','Fonctionnement','Objectifs','Coordonnées'];
  const sectors = ['Maintenance & installation','BTP & travaux','Distribution & grossiste','Industrie & production','Services aux entreprises','Formation & éducation','Immobilier','E-commerce & commerce','Transport & logistique','Hôtellerie & restauration','Santé & bien-être','Autre secteur'];
  const departments = [
    {id:'commercial',label:'Commercial & ventes',options:['Prospects et opportunités','Devis et relances','Reporting commercial','Suivi des contrats'],solution:'CRM adapté, suivi des opportunités et relances automatisées'},
    {id:'marches',label:'Appels d’offres & marchés publics',options:['Veille des consultations','Analyse RC / CPS','Pièces et dossiers','Délais de soumission'],solution:'Veille ciblée, assistant IA documentaire et suivi des échéances'},
    {id:'admin',label:'Administration & documents',options:['Classement des documents','Recherche d’informations','Saisie répétitive','Validations internes'],solution:'Gestion documentaire et workflows de validation'},
    {id:'finance',label:'Finance & comptabilité',options:['Factures émises','Paiements et relances','Rapprochements','Trésorerie'],solution:'Suivi des factures, alertes et reporting financier'},
    {id:'rh',label:'Ressources humaines',options:['Recrutement','Congés et absences','Pointage','Dossiers collaborateurs'],solution:'Outil RH léger, pointage et automatisation des demandes'},
    {id:'achats',label:'Achats & fournisseurs',options:['Fournisseurs','Demandes d’achat','Bons de commande','Approbations'],solution:'Suivi des fournisseurs, commandes et circuits de validation'},
    {id:'stock',label:'Stocks & logistique',options:['Inventaires','Ruptures de stock','Préparation de commandes','Livraisons'],solution:'Suivi de stock, alertes de seuil et traçabilité'},
    {id:'operations',label:'Production & opérations',options:['Planning des tâches','Suivi des équipes','Rapports d’activité','Coordination'],solution:'Logiciel métier, planning partagé et automatisations'},
    {id:'maintenance',label:'Maintenance & interventions',options:['Prise de rendez-vous','Affectation des techniciens','Fiches d’intervention','Maintenance préventive'],solution:'Planning d’interventions et application terrain'},
    {id:'marketing',label:'Marketing & acquisition',options:['Prospects entrants','Suivi des campagnes','Mesure des résultats','Contenus et diffusion'],solution:'Suivi des campagnes et automatisation de la qualification'},
    {id:'support',label:'Service client & support',options:['Délais de réponse','Traitement des réclamations','Canaux de contact','Demandes répétitives'],solution:'Gestion des tickets et assistance IA encadrée'},
    {id:'direction',label:'Direction & pilotage',options:['Indicateurs clés','Reporting des équipes','Suivi des marges','Alertes et décisions'],solution:'Consolidation des données et tableaux de bord'},
    {id:'informatique',label:'Informatique & données',options:['Logiciels non connectés','Accès et autorisations','Hébergement et sécurité','Coûts des outils'],solution:'Intégrations, outils sur mesure et gouvernance des accès'},
    {id:'qualite',label:'Qualité & conformité',options:['Contrôles récurrents','Incidents','Échéances et audits','Traçabilité'],solution:'Checklists, registres et alertes de conformité'}
  ];
  const problems = [
    'Leads et devis non suivis','Tâches et saisies manuelles','Outils et données dispersés',
    'Factures et paiements mal suivis','Stocks ou livraisons difficiles à piloter','Tâches et interventions désorganisées',
    'Dossiers longs ou complexes','Demandes clients mal traitées','Indicateurs peu fiables'
  ];
  const tools = ['Excel / Google Sheets','WhatsApp','E-mails','Papier / cahiers','CRM','ERP','Logiciel métier','Formulaires web','Automatisations existantes','Aucun outil structuré'];
  const goals = ['Gagner du temps','Réduire les erreurs','Suivre davantage de clients','Centraliser les informations','Piloter l’activité','Réduire les coûts','Accélérer les traitements','Sécuriser les données','Fluidifier le service client'];
  const impacts = ['Ventes ou devis perdus','Retards fréquents','Erreurs et ressaisies','Surcharge des équipes','Coûts difficiles à suivre','Insatisfaction clients','Échéances manquées','Difficulté à décider'];
  const dataTypes = ['Données clients','Données collaborateurs','Documents financiers','Documents contractuels','Informations confidentielles','Données non sensibles','Je ne sais pas'];
  const constraints = ['Budget limité','Conserver nos outils','Confidentialité des données','Hébergement local souhaité','Plusieurs sites / équipes','Formation des utilisateurs','Limiter les abonnements','Besoin d’intégrations','Disponibilité limitée'];
  const state = {sector:'',size:'',clientele:'',ville:'',role:'',departments:[],problems:[],followup:{},tools:[],softwareNames:'',centralisation:'',integration:'',volume:'',time:'',impacts:[],example:'',goals:[],timeline:'',constraints:[],dataTypes:[],hosting:'',budget:'',owner:'',decision:'',name:'',company:'',email:'',phone:'',channel:'',consent:false};
  let step=0;
  let lastFocus=null;
  let sending=false;
  const submissionId=()=>crypto.randomUUID();
  let currentSubmissionId=null;
  const chosen = (field,value) => Array.isArray(state[field]) ? state[field].includes(value) : state[field]===value;
  const opts = arr => arr.map(x=>typeof x==='string'?{value:x,label:x}:x);
  function question(title,content,{required=false,hint='',note=''}={}){
    return `<div class="question"><div class="question-head"><h3>${esc(title)}</h3><span class="${required?'required':'optional'}">${required?'* Requis':(note||'Facultatif')}</span></div>${hint?`<p class="question-hint">${esc(hint)}</p>`:''}${content}</div>`;
  }
  function choices(field,options,{mode='single',columns=3,descriptions=false}={}){
    return `<div class="choice-grid ${columns===2?'cols-2':columns===4?'cols-4':''}" role="group" aria-label="${esc(field)}">${opts(options).map(({value,label,desc})=>`<button type="button" class="choice ${mode==='multi'?'multi':''} ${descriptions?'two-line':''}" data-field="${esc(field)}" data-value="${esc(value)}" data-mode="${mode}" aria-pressed="${chosen(field,value)}"><span class="choice-text">${esc(label)}${desc?`<small>${esc(desc)}</small>`:''}</span></button>`).join('')}</div>`;
  }
  function multiPains(){return `<div class="problem-grid" role="group" aria-label="Problèmes prioritaires">${problems.map((p,i)=>`<button type="button" class="problem-choice" data-field="problems" data-value="${esc(p)}" data-mode="multi" data-max="4" aria-pressed="${chosen('problems',p)}"><span class="problem-index">${String(i+1).padStart(2,'0')}</span><span class="problem-text">${esc(p)}</span><span class="problem-check" aria-hidden="true"></span></button>`).join('')}</div>`;}
  function followups(){return state.departments.map(id=>{
    const dep=departments.find(d=>d.label===id);
    if(!dep)return '';
    return `<div class="followup-block"><h4 class="followup-title">Dans « ${esc(dep.label)} », où se situe surtout la difficulté ?</h4><div class="choice-grid cols-2" role="group" aria-label="${esc(dep.label)}">${dep.options.map(option=>`<button type="button" class="choice" data-followup="${esc(dep.id)}" data-value="${esc(option)}" aria-pressed="${state.followup[dep.id]===option}"><span class="choice-text">${esc(option)}</span></button>`).join('')}</div></div>`;
  }).join('');}
  const label = (over,title,description) => `<span class="step-overline">${over}</span><h2 class="step-title">${title}</h2><p class="step-desc">${description}</p>`;
  const field = (name,labelText,type='text',placeholder='',required=false)=>`<div class="field"><label for="f-${name}">${esc(labelText)} ${required?'<span class="required">*</span>':''}</label><input id="f-${name}" data-input="${name}" type="${type}" ${type==='email'?'autocomplete="email"':type==='tel'?'autocomplete="tel"':'autocomplete="off"'} placeholder="${esc(placeholder)}" value="${esc(state[name])}" ${required?'aria-required="true"':''}></div>`;
  const selectField = (name,labelText,options)=>`<div class="field"><label for="f-${name}">${esc(labelText)}</label><select data-input="${name}" id="f-${name}"><option value="">Choisir une option</option>${options.map(x=>`<option value="${esc(x)}" ${state[name]===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`;
  function content1(){return label('01 · L’ENTREPRISE','D’abord, quelques repères.','Ces informations nous aident à comprendre votre activité, sans vous demander de rédiger une présentation.')+
    question('Dans quel secteur exerce votre entreprise ?',choices('sector',sectors,{columns:3}),{required:true})+
    question('Quelle est la taille de votre équipe ?',choices('size',['1 personne','2 à 5','6 à 15','16 à 50','51 à 200','Plus de 200'],{columns:3}),{required:true})+
    question('Avec quels types de clients travaillez-vous ?',choices('clientele',['Entreprises (B2B)','Particuliers (B2C)','Les deux','Organismes publics'],{columns:2}),{required:false})+
    `<div class="field-grid">${selectField('ville','Ville principale',['Rabat','Salé','Casablanca','Marrakech','Fès','Tanger','Agadir','Kénitra','Autre ville'])}${selectField('role','Votre fonction',['Fondateur / gérant','Direction générale','Responsable commercial','Responsable opérationnel','Responsable administratif','Responsable informatique','Autre'])}</div>`;}
  function content2(){return label('02 · VOS PRIORITÉS','Où se trouvent les difficultés ?','Sélectionnez jusqu’à trois départements prioritaires, puis les problèmes qui concernent votre activité.')+
    question('Quels départements souhaitez-vous examiner ?',choices('departments',departments.map(d=>d.label),{mode:'multi',columns:2}),{required:true,hint:'Maximum 3 départements. Choisissez les plus urgents pour commencer.'})+
    `<div id="dept-followups">${followups()}</div>`+
    question('Quels problèmes reconnaissez-vous ?',multiPains(),{required:true,hint:'Sélectionnez jusqu’à 4 situations. Il n’est pas nécessaire qu’elles soient toutes présentes.'})+
    `<div class="section-tip"><span class="tip-symbol">i</span><span>Le diagnostic couvre vos enjeux prioritaires. Les autres départements pourront être analysés ensuite, si nécessaire.</span></div>`;}
  function content3(){return label('03 · VOTRE FONCTIONNEMENT','Comment travaillez-vous aujourd’hui ?','Quelques choix suffisent pour évaluer les outils utilisés, le volume et les conséquences possibles.')+
    question('Quels outils utilisez-vous au quotidien ?',choices('tools',tools,{mode:'multi',columns:2}),{required:true,hint:'Plusieurs réponses possibles.'})+
    `<div class="field field-software-names"><label for="f-softwareNames">Nom des logiciels déjà utilisés <span class="optional">· Facultatif</span></label><input id="f-softwareNames" data-input="softwareNames" type="text" maxlength="180" placeholder="Ex. : Sage, HubSpot, Odoo, logiciel interne…" value="${esc(state.softwareNames)}"></div>`+
    question('Vos informations sont-elles centralisées ?',choices('centralisation',['Oui, dans un outil','En partie','Non, elles sont dispersées','Je ne sais pas'],{columns:2}),{required:false})+
    question('Comment les outils échangent-ils leurs informations ?',choices('integration',['Principalement à la main','Quelques automatisations','Systèmes déjà connectés','Je ne sais pas'],{columns:2}),{required:false})+
    `<div class="field-grid"><div>${question('Combien d’opérations par semaine ?',choices('volume',['Moins de 10','10 à 50','51 à 200','Plus de 200','Difficile à estimer'],{columns:2}),{hint:'Demandes, dossiers, devis ou interventions : selon votre activité.'})}</div><div>${question('Temps perdu estimé chaque semaine ?',choices('time',['0 à 2 h','3 à 5 h','6 à 10 h','11 à 20 h','Plus de 20 h','Je ne sais pas'],{columns:2}),{hint:'Une estimation approximative suffit.'})}</div></div>`+
    question('Quelles conséquences ressentez-vous ?',choices('impacts',impacts,{mode:'multi',columns:2}),{hint:'Sélectionnez les conséquences les plus fréquentes (3 maximum).'})+
    `<div class="field"><label for="example">Un exemple concret, si vous le souhaitez <span class="optional">· Facultatif</span></label><textarea id="example" data-input="example" maxlength="650" placeholder="Ex. : les devis sont envoyés par WhatsApp, puis nous perdons la trace des relances. Évitez les noms de clients et les données confidentielles.">${esc(state.example)}</textarea></div>`;}
  function content4(){return label('04 · VOTRE PROJET','Qu’aimeriez-vous changer ?','Nous cherchons une direction réaliste, en tenant compte de vos priorités et de vos contraintes.')+
    question('Quels sont vos objectifs principaux ?',choices('goals',goals,{mode:'multi',columns:3}),{required:true,hint:'Choisissez jusqu’à 3 objectifs.'})+
    question('À quel horizon souhaitez-vous agir ?',choices('timeline',['Dès que possible','Sous 1 à 3 mois','Sous 3 à 6 mois','Je me renseigne'],{columns:2}))+
    question('Quelles contraintes faut-il respecter ?',choices('constraints',constraints,{mode:'multi',columns:3}),{hint:'Vous pouvez en sélectionner plusieurs.'})+
    question('Quelles données le projet pourrait-il traiter ?',choices('dataTypes',dataTypes,{mode:'multi',columns:3}),{hint:'Important pour déterminer les précautions de sécurité et de confidentialité.'})+
    question('Avez-vous une préférence d’hébergement ?',choices('hosting',['Cloud','Sur nos équipements','À étudier ensemble'],{columns:3}),{hint:'Cette réponse n’engage à aucune solution technique.'})+
    `<div class="field-grid">${selectField('budget','Budget indicatif (facultatif)',['Non défini','À discuter après diagnostic','Moins de 5 000 DH','5 000 à 15 000 DH','15 000 à 50 000 DH','Plus de 50 000 DH'])}${selectField('owner','Qui suivra le projet ?',['Le dirigeant','Une personne responsable','Direction + équipes','Service informatique','À définir'])}</div>`;}
  function summary(){
    const name=state.name?esc(state.name):'Non renseigné';
    const deps=state.departments.length?state.departments.join(' · '):'Aucun';
    const p=state.problems.length?state.problems.join(' · '):'Aucun';
    return `<div class="summary-panel"><div class="summary-row"><strong>Entreprise</strong><span>${esc(state.sector||'Non renseigné')} · ${esc(state.size||'—')}</span></div><div class="summary-row"><strong>Départements</strong><span>${esc(deps)}</span></div><div class="summary-row"><strong>Problèmes</strong><span>${esc(p)}</span></div><div class="summary-row"><strong>Outils</strong><span>${esc(state.tools.join(' · ')||'Non renseignés')}</span></div><div class="summary-row"><strong>Objectifs</strong><span>${esc(state.goals.join(' · ')||'À préciser')}</span></div></div>`;
  }
  function content5(){return label('05 · FINALISATION','Qui pouvons-nous recontacter ?','Nous avons les éléments nécessaires pour préparer un premier diagnostic. Vérifiez votre récapitulatif et laissez un moyen de vous joindre.')+
    `<div class="field-grid">${field('name','Votre nom complet','text','Prénom et nom',true)}${field('company','Nom de votre entreprise','text','Nom de votre société',true)}${field('email','E-mail professionnel','email','vous@entreprise.com')}${field('phone','Numéro de téléphone professionnel','tel','+212 6 ...',true)}</div>`+
    `<div class="form-field-spacer"></div>`+
    question('Comment préférez-vous échanger ?',choices('channel',['E-mail','Visioconférence','Téléphone'],{columns:2}),{hint:'Vous pouvez choisir une méthode écrite si vous le préférez.'})+
    `<div class="question"><div class="question-head"><h3>Récapitulatif de vos réponses</h3><span class="optional">Vérifiable</span></div>${summary()}</div>`+
    `<label class="privacy-check"><input id="consent" type="checkbox" ${state.consent?'checked':''}><span>J’accepte d’être recontacté au sujet de ma demande de diagnostic digital. Les informations seront enregistrées dans le CRM TheFounder pour traiter ma demande. J’ai consulté la <a href="/confidentialite" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>.</span></label>`+
    `<div class="section-tip"><span class="tip-symbol">i</span><span>Le rapport détaillé sera établi après analyse des réponses et vérification des contraintes, pas automatiquement sur la seule base des cases cochées.</span></div>`;}
  const builders=[content1,content2,content3,content4,content5];
  function nav(){
    $('steps').innerHTML=steps.map((x,i)=>`<button type="button" class="step-tab ${i===step?'active':i<step?'done':''}" data-go="${i}" ${i>step?'disabled':''} ${i===step?'aria-current="step"':''}><span class="step-dot">${i<step?'✓':i+1}</span><span>${esc(x)}</span></button>`).join('');
    $('step-label').textContent=`ÉTAPE ${String(step+1).padStart(2,'0')} / 05`;
    const percent=(step+1)*20;
    $('progress-percent').textContent=percent+' %';$('progress-fill').style.width=percent+'%';$('progress-track').setAttribute('aria-valuenow',percent);
    $('back').hidden=step===0;
    $('next').innerHTML=step===4?'Envoyer mon diagnostic <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>':'Continuer <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  }
  function render(){
    nav();$('form-content').innerHTML=builders[step]();$('form-error').hidden=true;
  }
  function showError(msg){const el=$('form-error');el.textContent=msg;el.hidden=false;el.scrollIntoView({behavior:'smooth',block:'center'});}
  function validate(){
    if(step===0){if(!state.sector)return 'Sélectionnez votre secteur d’activité.';if(!state.size)return 'Sélectionnez la taille de votre équipe.';}
    if(step===1){if(!state.departments.length)return 'Sélectionnez au moins un département à examiner.';if(!state.problems.length)return 'Sélectionnez au moins un problème rencontré.';}
    if(step===2 && !state.tools.length)return 'Indiquez au moins un outil utilisé (ou « Aucun outil structuré »).';
    if(step===3 && !state.goals.length)return 'Choisissez au moins un objectif principal.';
    if(step===4){if(!state.name.trim())return 'Indiquez votre nom.';if(!state.company.trim())return 'Indiquez le nom de votre entreprise.';
      if(!state.phone.trim())return 'Indiquez un numéro de téléphone professionnel.';
      if(!/^[+\d\s().-]{7,25}$/.test(state.phone.trim()))return 'Vérifiez le format du numéro de téléphone (indicatif inclus).';
      if(state.email&& !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim()))return 'Vérifiez le format de l’adresse e-mail.';
      if(!state.consent)return 'Pour finaliser la demande, confirmez votre accord pour être recontacté.';}
    return '';
  }
  function setButtons(field){document.querySelectorAll(`[data-field="${field}"]`).forEach(btn=>btn.setAttribute('aria-pressed',String(chosen(field,btn.dataset.value))));}
  $('form-content').addEventListener('click',e=>{
    const follow=e.target.closest('[data-followup]');if(follow){
      state.followup[follow.dataset.followup]=follow.dataset.value;
      document.querySelectorAll(`[data-followup="${follow.dataset.followup}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.value===follow.dataset.value)));
      $('form-error').hidden=true;return;
    }
    const btn=e.target.closest('[data-field]');if(!btn)return;
    const {field,value,mode}=btn.dataset;
    if(mode==='multi'){
      const max=field==='departments'?3:field==='problems'?4:field==='goals'?3:field==='impacts'?3:99;
      if(field==='tools'&&value==='Aucun outil structuré')state.tools=[];
      if(field==='tools'&&value!=='Aucun outil structuré')state.tools=state.tools.filter(x=>x!=='Aucun outil structuré');
      const values=state[field];if(values.includes(value))state[field]=values.filter(x=>x!==value);
      else if(values.length<max)state[field]=[...values,value];
      else{showError(`Vous pouvez choisir ${max} éléments maximum pour cette question.`);return;}
      if(field==='departments'){
        Object.keys(state.followup).forEach(k=>{if(!state.departments.includes(departments.find(d=>d.id===k)?.label))delete state.followup[k];});
        $('dept-followups').innerHTML=followups();
      }
    }else state[field]=value;
    setButtons(field);$('form-error').hidden=true;
  });
  $('form-content').addEventListener('input',e=>{const field=e.target.dataset.input;if(field&&Object.prototype.hasOwnProperty.call(state,field))state[field]=e.target.value;});
  $('form-content').addEventListener('change',e=>{const field=e.target.dataset.input;if(field&&Object.prototype.hasOwnProperty.call(state,field))state[field]=e.target.value;if(e.target.id==='consent')state.consent=e.target.checked;});
  $('next').addEventListener('click',()=>{const err=validate();if(err)return showError(err);if(step<4){step++;render();$('steps').scrollIntoView({behavior:'smooth',block:'start'});}else sendDiagnostic();});
  $('back').addEventListener('click',()=>{if(step>0){step--;render();$('steps').scrollIntoView({behavior:'smooth',block:'start'});}});
  $('steps').addEventListener('click',e=>{const tab=e.target.closest('[data-go]');if(!tab)return;const target=Number(tab.dataset.go);if(target>=0&&target<step){step=target;render();}});
  function proposal(){const selected=departments.filter(d=>state.departments.includes(d.label));return selected.slice(0,3);}
  function renderResult(){
    const selected=proposal();
    const rows=selected.map(dep=>`<p><strong>${esc(dep.label)} :</strong> ${esc(dep.solution)}.</p>`).join('');
    $('result-content').innerHTML=`<h3>Entreprise</h3><p>${esc(state.company)} · ${esc(state.sector)} · ${esc(state.size)}.</p>
      <h3>Priorités déclarées</h3><p>${esc(state.problems.join(' ; '))}.</p>
      <h3>Fonctionnement actuel</h3><p>Outils : ${esc(state.tools.join(', '))}. ${state.softwareNames?'Logiciels cités : '+esc(state.softwareNames)+'.':''} ${state.time?'Temps perdu déclaré : '+esc(state.time)+'.':''} ${state.centralisation?'Centralisation : '+esc(state.centralisation)+'.':''}</p>
      <h3>Pistes techniques à vérifier</h3>${rows||'<p>À étudier lors du diagnostic.</p>'}<p class="notice-plain">Ce sont des hypothèses, pas des recommandations définitives. Il faudra vérifier les processus, la qualité des données, les risques, les coûts et les outils réellement disponibles.</p>
      <h3>Objectifs et calendrier</h3><p>${esc(state.goals.join(', ')||'Non précisés')} ${state.timeline?'· '+esc(state.timeline):''}</p>`;
  }
  async function sendDiagnostic(){
    if(sending)return;
    sending=true;
    const button=$('next');
    button.disabled=true;
    button.textContent='Transmission en cours…';
    $('form-error').hidden=true;
    currentSubmissionId ||= submissionId();
    try {
      const response=await fetch('/api/diagnostic',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'same-origin',
        body:JSON.stringify({
          submissionId:currentSubmissionId,
          answers:{...state,phone:state.phone.trim(),email:state.email.trim()},
          website:'',
          fax:''
        }),
        signal:AbortSignal.timeout(20000)
      });
      const data=await response.json().catch(()=>null);
      if(!response.ok||!data?.ok||!data?.reference)throw Error(
        response.status===429?'Trop de demandes depuis ce réseau. Réessayez plus tard.':
        response.status===422?'Certaines réponses doivent être corrigées.':
        'Votre demande n’a pas pu être enregistrée. Réessayez dans un instant.'
      );
      const wizard=document.querySelector('.wizard');
      wizard.innerHTML='<div class="diagnostic-success" role="status" tabindex="-1"><div class="modal-top-icon" aria-hidden="true">✓</div><h2>Merci pour votre confiance !</h2><p>Votre demande de diagnostic a bien été reçue.</p><p>Notre équipe analysera vos besoins et vous contactera prochainement pour échanger sur votre projet.</p><p><strong>L’équipe TheFounder</strong></p><a class="secondary-action" href="/">Retour au site</a></div>';
      wizard.querySelector('.diagnostic-success').focus();
      document.querySelector('.privacy-footnote')?.remove();
    }catch(error){
      showError(error?.message==='The operation was aborted.'?'Le délai de connexion est dépassé. Vérifiez votre connexion et réessayez.':error?.message||'Enregistrement impossible. Réessayez.');
    }finally{
      sending=false;
      if(button.isConnected){button.disabled=false;nav();}
    }
  }
  function formatPlain(){
    const chosenDepts=proposal();return `PRÉDIAGNOSTIC — THEFOUNDER\nEntreprise : ${state.company}\nContact : ${state.name}\nSecteur : ${state.sector}\nTaille : ${state.size}\nClientèle : ${state.clientele||'Non indiquée'}\nVille : ${state.ville||'Non indiquée'}\nDépartements : ${state.departments.join(', ')}\nDétails par département : ${chosenDepts.map(d=>d.label+' : '+(state.followup[d.id]||'Non précisé')).join(' ; ')}\nProblèmes : ${state.problems.join(' ; ')}\nOutils actuels : ${state.tools.join(', ')}\nLogiciels cités : ${state.softwareNames||'Non précisés'}\nCentralisation : ${state.centralisation||'Non précisée'}\nIntégrations : ${state.integration||'Non précisées'}\nVolume : ${state.volume||'Non précisé'}\nTemps perdu estimé : ${state.time||'Non précisé'}\nImpacts : ${state.impacts.join(', ')}\nExemple : ${state.example||'Non fourni'}\nObjectifs : ${state.goals.join(', ')}\nÉchéance : ${state.timeline||'Non précisée'}\nContraintes : ${state.constraints.join(', ')}\nTypes de données : ${state.dataTypes.join(', ')}\nHébergement : ${state.hosting||'Non précisé'}\nBudget : ${state.budget||'Non communiqué'}\nProjet suivi par : ${state.owner||'Non précisé'}\nMoyen préféré : ${state.channel||'Non précisé'}\nE-mail : ${state.email||'Non indiqué'}\nTéléphone : ${state.phone||'Non indiqué'}\n\nDocument préparatoire, sans diagnostic automatique confirmé.`;
  }
  $('copy-summary').addEventListener('click',async()=>{
    const button=$('copy-summary');
    try{await navigator.clipboard.writeText(formatPlain());button.textContent='Synthèse copiée';}
    catch{const el=document.createElement('textarea');el.value=formatPlain();document.body.appendChild(el);el.select();try{document.execCommand('copy');button.textContent='Synthèse copiée';}catch{button.textContent='Copie non disponible';}el.remove();}
    setTimeout(()=>button.textContent='Copier la synthèse',1800);
  });
  $('export-json').addEventListener('click',()=>{
    const exportData={schema:'thefounder-prediagnostic-v1',mode:'export_utilisateur',createdAt:new Date().toISOString(),responses:{...state},hypotheses:proposal().map(dep=>({departement:dep.label,piste:dep.solution,verificationRequise:true}))};
    const blob=new Blob([JSON.stringify(exportData,null,2)],{type:'application/json;charset=utf-8'});
    const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='thefounder-prediagnostic-reponses.json';a.click();URL.revokeObjectURL(u);
  });
  render();
})();
