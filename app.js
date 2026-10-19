const caseData = {
  beanflow: {
    type: 'Коммерческий опыт · BeanFlow · ноябрь 2025 — июль 2026',
    title: 'Проверить ценовую гипотезу до изменения прайса',
    question: 'Какие предложения конкурентов сопоставимы с ассортиментом и какие ценовые изменения стоит проверить с учётом юнит-экономики?',
    approach: ['Автоматизировал сбор предложений из HTML и JSON-LD с Python.', 'Нормализовал данные, удалял дубликаты и выделял сопоставимые позиции.', 'Сопоставлял рыночные цены с показателями бизнеса за 90 дней, используя Python, SQL и Excel.', 'Подготовил рекомендации по ценообразованию и план проверки гипотезы на контрольной группе.'],
    result: 'Результат работы — подготовленные данные для сравнения цен, расчёт ценовых сценариев и план проверки гипотезы. Рекомендации связывают рыночную ситуацию с экономикой товара.',
    limit: 'Расчётный эффект не равен реализованному росту прибыли. Подтверждённый результат эксперимента не заявлен. Коммерческие данные и внутренние материалы компании на сайте не публикуются.',
    relevance: 'Для задач конкурентного анализа, ценообразования и подготовки управленческих решений.',
    link: null
  },
  regression: {
    type: 'Проект портфолио · Automobile Regression Pipeline',
    title: 'Разобраться, с чем связана цена автомобиля',
    question: 'Как подготовить таблицу характеристик автомобилей и изучить связь признаков с ценой в воспроизводимом расчёте?',
    approach: ['Диагностика структуры таблицы, пропусков, дубликатов, выбросов и корреляций.', 'Подготовка признаков: заполнение пропусков, преобразования, кодирование и масштабирование.', 'Линейная регрессия OLS, отбор переменных и кросс-валидация с повторным использованием разбиений.', 'Сохранение коэффициентов, доверительных интервалов, VIF, прогнозов, остатков и параметров запуска.'],
    result: 'Модульный сценарий run_all.py формирует диагностику, подготовленные данные, историю отбора и регрессионный отчёт в XLSX. Графики показывают остатки и оценки коэффициентов.',
    limit: 'Подготовка данных выполняется до разбиений кросс-валидации, а отбор и итоговая оценка используют одинаковые разбиения. Метрики не служат независимой оценкой на новых данных. Исходный набор данных в репозитории отсутствует; численные показатели качества здесь не заявлены.',
    relevance: 'Для исследовательского анализа, диагностики данных и проверки статистических предположений.',
    link: 'https://github.com/GANRA3EV/automobile-regression-pipeline'
  },
  triage: {
    type: 'Проект портфолио · Fintech Triage',
    title: 'Разделить поток обращений по темам и срочности',
    question: 'Как классифицировать русскоязычные обращения и направлять оператору случаи, которым нужна ручная проверка?',
    approach: ['Объединение сообщений одной переписки по времени и подготовка текстовых признаков.', 'Три варианта признаков: TF-IDF, rubert-tiny2 и multilingual-e5 с обучаемыми классификаторами.', 'Временное разделение выборок, удаление дубликатов и контроль пересечений клиентов.', 'Оценка Macro-F1 и матриц ошибок, порог передачи оператору и сохранение причин проверки.'],
    result: 'Сценарии обучения и прогноза читают XLSX и сохраняют темы, срочность, оценки уверенности и причины передачи оператору. Краткое резюме извлекается из предложений исходного обращения.',
    limit: 'Демонстрационный запуск использует синтетические обращения. Его метрики проверяют работу кода и не подтверждают качество на реальном клиентском потоке. Пример на карточке иллюстрирует задачу, а не вывод запущенной модели.',
    relevance: 'Для первичной классификации обращений, анализа текстовых массивов и поддержки операторов.',
    link: 'https://github.com/GANRA3EV/fintech-triage'
  },
  web: {
    type: 'Проект портфолио · Research Web Pipeline',
    title: 'Собрать веб-данные с проверяемым происхождением',
    question: 'Как получить тексты статических и динамических страниц, сохранив источник каждой записи и возможность повторной обработки?',
    approach: ['Выбор загрузчика для страниц с исходным HTML или JavaScript.', 'Извлечение и очистка текста, удаление дубликатов.', 'Сохранение URL, контрольных сумм, исходных страниц и журналов запуска.', 'Выгрузка в XLSX и отдельное подключение классификации через Fintech Triage.'],
    result: 'Настраиваемый сценарий сбора текстов с таблицами результатов и журналом происхождения. Сохранённые страницы подходят для повторного извлечения без повторной загрузки.',
    limit: 'Классификатор подключается отдельно. Качество извлечения зависит от страницы и загрузчика. Сводная скорость, процент успешного извлечения и экономия времени на сайте не заявлены.',
    relevance: 'Для сбора исследовательских корпусов, мониторинга источников и подготовки текстовых данных.',
    link: 'https://github.com/GANRA3EV/research-web-pipeline'
  }
};
const dialog = document.querySelector('#case-dialog');
const content = document.querySelector('#dialog-content');
let previousFocus;
document.querySelectorAll('.case-open').forEach(button => {
  button.addEventListener('click', () => {
    const item = caseData[button.dataset.case];
    previousFocus = button;
    content.innerHTML = `<p class="eyebrow">${item.type}</p><h2 id="dialog-title">${item.title}</h2><h3>Задача</h3><p>${item.question}</p><h3>Как решал</h3><ul>${item.approach.map(line => `<li>${line}</li>`).join('')}</ul><h3>Результат</h3><p>${item.result}</p><div class="case-limit"><h3>Границы результата</h3><p>${item.limit}</p></div>${item.link ? `<a class="button primary" href="${item.link}" target="_blank" rel="noopener">Код и документация <span>↗</span></a>` : '<a class="button primary" href="https://t.me/pesegov02" target="_blank" rel="noopener">Обсудить подход <span>↗</span></a>'}`;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if (event.target === dialog) {const box = dialog.getBoundingClientRect(); if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();}});
dialog.addEventListener('close', () => {document.body.classList.remove('modal-open');previousFocus?.focus();});
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => {item.classList.toggle('active', item === button);item.setAttribute('aria-pressed', String(item === button));});
    let count = 0;
    document.querySelectorAll('.case').forEach(card => {card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;if(!card.hidden) count++;});
    document.querySelector('#filter-status').textContent = `Показано кейсов: ${count}`;
  });
});
document.querySelector('.copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {await navigator.clipboard.writeText('nizhnickv@yandex.ru');status.textContent = 'Почта скопирована';}
  catch {status.textContent = 'Почта для копирования: nizhnickv@yandex.ru';}
});

const trendPositions = [132, 143, 100, 123, 94, 110, 71, 90, 60, 78, 37, 54];
const residualPositions = [77, 107, 55, 95, 69, 113, 59, 100, 63, 105, 65, 94];
document.querySelectorAll('.chart-tab').forEach(button => {
  button.addEventListener('click', () => {
    const residual = button.dataset.chart === 'residual';
    document.querySelectorAll('.chart-tab').forEach(tab => {tab.classList.toggle('active',tab === button);tab.setAttribute('aria-pressed',String(tab === button));});
    document.querySelector('.chart-line').setAttribute('d',residual ? 'M40 85H445' : 'M40 145L445 38');
    document.querySelector('.chart-band').setAttribute('d',residual ? 'M40 50H445V120H40Z' : 'M40 120L445 12V64L40 162Z');
    document.querySelectorAll('.chart-points circle').forEach((point,index) => point.setAttribute('cy',(residual ? residualPositions : trendPositions)[index]));
    document.querySelector('#chart-title').textContent = residual ? 'Схема остатков вокруг нулевой линии, иллюстрация метода' : 'Схема регрессии, иллюстрация метода';
  });
});
const webStages = {
  source:{label:'https:// → текст',note:'HTML или JavaScript — загрузчик под задачу.',widths:['85%','60%','75%','45%']},
  clean:{label:'текст → очистка',note:'Нормализация текста и удаление дубликатов.',widths:['85%','85%','85%','85%']},
  export:{label:'текст + URL → XLSX',note:'Тексты, исходные URL и журнал запуска.',widths:['95%','95%','95%','95%']}
};
document.querySelectorAll('.web-stage').forEach(button => {
  button.addEventListener('click', () => {
    const stage = webStages[button.dataset.stage];
    document.querySelectorAll('.web-stage').forEach(tab => {tab.classList.toggle('active',tab === button);tab.setAttribute('aria-pressed',String(tab === button));});
    document.querySelector('#browser-label').textContent = stage.label;
    document.querySelector('#web-stage-note').textContent = stage.note;
    document.querySelectorAll('.code-line').forEach((line,index) => {line.style.width = stage.widths[index];});
  });
});
