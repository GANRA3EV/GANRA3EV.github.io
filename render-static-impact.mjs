import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {calculate} from './scenario-calculations.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const n=(value,digits=0)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:digits}).format(value);
const definitions={
  beanflow:{title:'Экономика ценового решения',metric:'Маржинальный доход за месяц',unit:'₽',main:'percent',facts:['Цена +4%','Объём продаж −2%','Себестоимость без изменений']},
  regression:{title:'Автоматизация отчёта',metric:'Время подготовки отчётов за месяц',unit:'ч',main:'hours',facts:['20 отчётов в месяц','90 → 15 минут на отчёт']},
  triage:{title:'Первичная маршрутизация',metric:'Трудозатраты на маршрутизацию за месяц',unit:'ч',main:'percent',facts:['1 000 обращений в месяц','Автоматизация 70%','Проверка 0,3 мин']},
  web:{title:'Сбор данных без рутины',metric:'Время сбора и проверки за месяц',unit:'ч',main:'hours',facts:['12 выгрузок в месяц','4 ч → 50 мин на выгрузку']}
};
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [key,spec] of Object.entries(definitions)){
  const r=calculate(key);
  const before=`${n(r.before,spec.unit==='ч'?1:0)} ${spec.unit}`;
  const after=`${n(r.after,spec.unit==='ч'?1:0)} ${spec.unit}`;
  const max=Math.max(r.before,r.after);
  const kpi=spec.main==='hours'?`${n(r.difference,1)} ч`:`${key==='beanflow'?'+':'−'}${n(r.percent,1)}%`;
  const label=spec.main==='hours'?'расчётная экономия за месяц':key==='beanflow'?'расчётное изменение маржинального дохода':'расчётное изменение трудозатрат';
  const secondary=key==='beanflow'?`+${n(r.difference)} ₽ при заданных цене и объёме`:spec.main==='hours'?`−${n(r.percent,1)}% времени относительно ручной работы`:`${n(r.difference,1)} ч освобождается в месяц`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 140"><title>Условный сценарий: до ${before}, после ${after}</title><g font-family="Times New Roman,serif" fill="#191919" font-size="17"><text x="0" y="34">До</text><text x="0" y="102">После</text><text x="560" y="34" text-anchor="end">${before}</text><text x="560" y="102" text-anchor="end">${after}</text></g><path d="M0 52H560M0 120H560" stroke="#191919" stroke-opacity=".1" stroke-width="12"/><path d="M0 52H${(r.before/max*560).toFixed(2)}" stroke="#191919" stroke-width="12"/><path d="M0 120H${(r.after/max*560).toFixed(2)}" stroke="#E75B28" stroke-width="12"/></svg>`;
  fs.writeFileSync(path.join(root,'assets',`impact-${key}.svg`),svg);
  const panel=`<aside class="impact-panel static-impact" data-impact="${key}" aria-label="Условный эффект: ${spec.title}"><div class="impact-header"><span class="scenario-badge"><i></i> УСЛОВНЫЙ СЦЕНАРИЙ</span><span class="impact-sign">↗</span></div><h3>${spec.title}</h3><div class="impact-primary"><strong>${kpi}</strong><span>${label}</span></div><figure class="static-chart"><figcaption>${spec.metric}</figcaption><img src="assets/impact-${key}.svg" alt="Условные данные: до ${before}, после ${after}" width="560" height="140" loading="lazy"></figure><p class="impact-secondary">${secondary}</p><div class="scenario-facts">${spec.facts.map(f=>`<span>${f}</span>`).join('')}</div><p class="scenario-footnote">Расчёт на условных вводных. Фактический эффект компании не измерен.</p></aside>`;
  const re=new RegExp(`<aside class="impact-panel[^\"]*" data-impact="${key}"[^>]*>[\\s\\S]*?<\\/aside>`);
  if(!re.test(html))throw new Error(`Панель ${key} не найдена`);
  html=html.replace(re,panel);
}
html=html.replace('Рядом с кейсами — расчёты на условных вводных. Изменяйте допущения и сравнивайте сценарии. Фактические результаты компаний не заявлены.','Рядом с кейсами — статичные иллюстрации расчётного эффекта. Данные условные; фактические результаты компаний не заявлены.');
html=html.replace(/<script type="module" src="impact\.js[^\"]*"><\/script>/,'');
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('Сохранены четыре статичные панели и четыре SVG-диаграммы.');
