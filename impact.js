import {defaults,calculate} from './scenario-calculations.mjs';

const number = (value,digits=0) => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:digits}).format(value);
const specifications = {
  beanflow:{
    title:'Экономика ценового решения',metric:'Маржинальный доход за месяц',unit:'₽',main:'percent',
    controls:[{key:'priceChange',label:'Изменение цены',min:0,max:10,step:0.5,unit:'%'},{key:'volumeDrop',label:'Снижение продаж',min:0,max:15,step:0.5,unit:'%'}],
    facts:['Цена 1 000 ₽','Себестоимость 700 ₽','Продажи 1 000 шт./мес'],
    formula:'До: (1 000 − 700) × 1 000. После: (новая цена − 700) × новый объём. Изменение дохода / исходный доход × 100%.',
    note:'Издержки на единицу фиксированы. Постоянные расходы, налоги и реакция конкурентов не учтены. Изменение спроса задаётся вручную.'
  },
  regression:{
    title:'Автоматизация отчёта',metric:'Время подготовки отчётов за месяц',unit:'ч',main:'hours',
    controls:[{key:'reports',label:'Отчётов за месяц',min:5,max:80,step:5,unit:''},{key:'automatedMinutes',label:'Один отчёт после автоматизации',min:5,max:90,step:5,unit:'мин'}],
    facts:['До: 90 мин/отчёт','После: ввод ползунком','Качество прогноза отдельно'],
    formula:'Часы до = число отчётов × 90 / 60. Часы после = число отчётов × время одного отчёта / 60. Экономия = часы до − часы после.',
    note:'Затраты на разработку и сопровождение не входят в формулу. Точность прогноза оценивается отдельно от экономии времени.'
  },
  triage:{
    title:'Первичная маршрутизация',metric:'Трудозатраты на маршрутизацию за месяц',unit:'ч',main:'percent',
    controls:[{key:'requests',label:'Обращений за месяц',min:100,max:10000,step:100,unit:''},{key:'automatedShare',label:'Доля автоматической обработки',min:0,max:90,step:5,unit:'%'}],
    facts:['Вручную: 2 мин','Проверка: 0,3 мин','Ошибки не оценены'],
    formula:'Часы до = обращения × 2 / 60. Часы после = обращения × ((1 − доля) × 2 + доля × 0,3) / 60.',
    note:'Доля автоматизации задаётся ползунком. Ошибки и повторные проверки в формулу не входят. Время решения обращения оценивается отдельно.'
  },
  web:{
    title:'Сбор данных без рутины',metric:'Время сбора и проверки за месяц',unit:'ч',main:'hours',
    controls:[{key:'batches',label:'Выгрузок за месяц',min:1,max:30,step:1,unit:''},{key:'reviewMinutes',label:'Проверка одной выгрузки',min:0,max:180,step:5,unit:'мин'}],
    facts:['Вручную: 4 ч/выгрузка','Сбор: 20 мин','Проверка: ввод ползунком'],
    formula:'Часы до = выгрузки × 240 / 60. Часы после = выгрузки × (20 + время проверки) / 60. Экономия = часы до − часы после.',
    note:'Время сбора зависит от источников. Не учтены разработка, сбои, изменения страниц и сопровождение.'
  }
};

document.querySelectorAll('[data-impact]').forEach(panel => {
  const key = panel.dataset.impact;
  const spec = specifications[key];
  panel.setAttribute('aria-label',`Калькулятор эффекта: ${spec.title}`);
  const state = {...defaults[key]};
  panel.innerHTML = `<div class="impact-header"><span class="impact-sign">↗</span></div><h3>Калькулятор: ${spec.title}</h3><div class="impact-primary" aria-live="polite"><strong data-kpi></strong><span data-kpi-label></span></div><div class="impact-chart"><p>${spec.metric}</p><div class="impact-bar-row"><span>База</span><div class="impact-track"><i data-before-bar></i></div><strong data-before></strong></div><div class="impact-bar-row after"><span>Вариант</span><div class="impact-track"><i data-after-bar></i></div><strong data-after></strong></div></div><p class="impact-secondary" data-secondary></p><div class="impact-controls">${spec.controls.map(control=>`<label class="impact-control" for="${key}-${control.key}"><span>${control.label}<output for="${key}-${control.key}" data-output="${control.key}"></output></span><input type="range" id="${key}-${control.key}" data-param="${control.key}" min="${control.min}" max="${control.max}" step="${control.step}" value="${state[control.key]}"></label>`).join('')}</div><div class="scenario-facts">${spec.facts.map(fact=>`<span>${fact}</span>`).join('')}</div><details class="scenario-method"><summary>Параметры и формула <span>+</span></summary><p>${spec.formula}</p><p>${spec.note}</p></details>`;

  function render(){
    const result = calculate(key,state);
    const positive = result.difference >= 0;
    panel.querySelector('[data-kpi]').textContent = spec.main === 'hours' ? `${number(Math.abs(result.difference),1)} ч` : `${key==='beanflow'?(positive?'+':'−'):(positive?'−':'+')}${number(Math.abs(result.percent),1)}%`;
    panel.querySelector('[data-kpi-label]').textContent = spec.main === 'hours' ? (positive?'экономия за месяц при выбранных параметрах':'рост трудозатрат при выбранных параметрах') : (key==='beanflow'?'изменение маржинального дохода при выбранных параметрах':'изменение трудозатрат при выбранных параметрах');
    panel.querySelector('[data-before]').textContent = `${number(result.before,spec.unit==='ч'?1:0)} ${spec.unit}`;
    panel.querySelector('[data-after]').textContent = `${number(result.after,spec.unit==='ч'?1:0)} ${spec.unit}`;
    const max = Math.max(result.before,result.after,1);
    panel.querySelector('[data-before-bar]').style.width = `${result.before/max*100}%`;
    panel.querySelector('[data-after-bar]').style.width = `${result.after/max*100}%`;
    panel.querySelector('[data-secondary]').textContent = key === 'beanflow' ? `${positive?'+':'−'}${number(Math.abs(result.difference))} ₽ при заданных цене и объёме` : (spec.main==='hours' ? `${positive?'−':'+'}${number(Math.abs(result.percent),1)}% времени относительно ручной работы` : `${number(Math.abs(result.difference),1)} ч ${positive?'освобождается':'добавляется'} в месяц`);
    spec.controls.forEach(control=>{
      const output = panel.querySelector(`[data-output="${control.key}"]`);
      output.textContent = `${number(state[control.key],1)}${control.unit?' '+control.unit:''}`;
      panel.querySelector(`[data-param="${control.key}"]`).setAttribute('aria-valuetext',output.textContent);
    });
  }
  panel.querySelectorAll('input').forEach(input => input.addEventListener('input',()=>{state[input.dataset.param]=Number(input.value);render();}));
  render();
});
