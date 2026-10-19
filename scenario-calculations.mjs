// Все исходные значения условные. Замеры компаний и проектов отсутствуют.
export const defaults = {
  beanflow:{price:1000,cost:700,units:1000,priceChange:4,volumeDrop:2},
  regression:{reports:20,manualMinutes:90,automatedMinutes:15},
  triage:{requests:1000,manualMinutes:2,automatedShare:70,reviewMinutes:0.3},
  web:{batches:12,manualMinutes:240,collectionMinutes:20,reviewMinutes:30}
};

function check(values) {
  for(const value of Object.values(values)) {
    if(!Number.isFinite(value) || value < 0) throw new RangeError('Вводные должны быть конечными неотрицательными числами');
  }
}

export function calculate(key, input = defaults[key]) {
  if(!defaults[key]) throw new RangeError('Неизвестный сценарий');
  const p = {...defaults[key],...input};
  check(p);
  let before, after;
  if(key === 'beanflow') {
    if(p.volumeDrop > 100 || p.cost >= p.price || p.units === 0) throw new RangeError('Некорректная экономика товара');
    before = (p.price-p.cost)*p.units;
    after = (p.price*(1+p.priceChange/100)-p.cost)*p.units*(1-p.volumeDrop/100);
  } else if(key === 'regression') {
    before = p.reports*p.manualMinutes/60;
    after = p.reports*p.automatedMinutes/60;
  } else if(key === 'triage') {
    if(p.automatedShare > 100) throw new RangeError('Доля не может превышать 100%');
    before = p.requests*p.manualMinutes/60;
    after = p.requests*((1-p.automatedShare/100)*p.manualMinutes + p.automatedShare/100*p.reviewMinutes)/60;
  } else {
    before = p.batches*p.manualMinutes/60;
    after = p.batches*(p.collectionMinutes+p.reviewMinutes)/60;
  }
  const difference = key === 'beanflow' ? after-before : before-after;
  return {before,after,difference,percent:before ? difference/before*100 : 0,input:p};
}
