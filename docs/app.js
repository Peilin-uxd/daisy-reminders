(function () {
  var palette = {
    mustard: { bg: '#E8A93C', text: '#4A3410' },
    olive: { bg: '#7C8B3D', text: '#FBF1DC' },
    sky: { bg: '#A9CDE8', text: '#1F3A52' },
    pink: { bg: '#F0A8C6', text: '#6B2745' },
    red: { bg: '#C0392B', text: '#FBF1DC' },
    orange: { bg: '#E8791E', text: '#FBF1DC' }
  };

  var reminders = [
    { color: 'pink', title: "Trust your body", body: "It's doing something extraordinary, even on the days it feels unfamiliar or uncomfortable." },
    { color: 'olive', title: "Rest without guilt", body: "Growing a person is already full-time work. A nap is productive." },
    { color: 'sky', title: "Practice asking for help", body: "Let people carry things for you now. It's good practice for after the baby comes too." },
    { color: 'mustard', title: "Drink some water", body: "Staying hydrated helps with energy, swelling, and those afternoon headaches." },
    { color: 'red', title: "Eat what sounds good", body: "Some days that's a salad, some days it's crackers. Nourishment doesn't have to be perfect." },
    { color: 'orange', title: "Move a little today", body: "A short, gentle walk can ease aches and lift your mood more than you'd expect." },
    { color: 'pink', title: "Write down how you feel", body: "Excited, nervous, tired, all of it is worth keeping. Future you will love reading this." },
    { color: 'olive', title: "Talk to the baby", body: "Bonding doesn't wait for the due date. Say hello whenever you feel like it." },
    { color: 'sky', title: "Ask your questions", body: "No question is too small for your midwife or doctor. That's what appointments are for." },
    { color: 'mustard', title: "Pack at your own pace", body: "The hospital bag doesn't need to be finished today. Add one thing at a time." },
    { color: 'red', title: "Let the nursery wait", body: "It can come together in stages. There's no deadline but the one you set." },
    { color: 'orange', title: "Nap when your body asks", body: "Sleep now is an investment, not laziness. Take it when you can get it." },
    { color: 'pink', title: "Lean on your people", body: "Let your partner, family, or friends carry a little of this with you." },
    { color: 'olive', title: "Feel it all", body: "Joy and fear can sit in the same day. Both are a normal part of this." },
    { color: 'sky', title: "Celebrate this week", body: "Another week further along is worth noticing, even on the hard days." },
    { color: 'mustard', title: "You're already caring for them", body: "Every glass of water, every rest, every check-up, it all counts. You're already a good mom." }
  ];

  var queue = [];
  var lastIndex = null;

  function refillQueue() {
    queue = reminders.map(function (_, i) { return i; });
    for (var i = queue.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = queue[i]; queue[i] = queue[j]; queue[j] = tmp;
    }
    if (lastIndex !== null && queue[0] === lastIndex && queue.length > 1) {
      var t = queue[0]; queue[0] = queue[1]; queue[1] = t;
    }
  }

  function getNext() {
    var reshuffled = false;
    if (queue.length === 0) { refillQueue(); reshuffled = true; }
    var idx = queue.shift();
    lastIndex = idx;
    return { item: reminders[idx], reshuffled: reshuffled };
  }

  function populateFront(item) {
    var front = document.getElementById('cardFront');
    var p = palette[item.color];
    front.style.background = p.bg;
    front.style.color = p.text;
    document.getElementById('frontTitle').textContent = item.title;
    document.getElementById('frontBody').textContent = item.body;
  }

  refillQueue();
  document.getElementById('deckCount').textContent = queue.length + ' cards in the deck';

  var angle = 0;
  var firstDraw = true;

  function draw() {
    var result = getNext();
    var target = firstDraw ? 180 : angle + 360;
    var inner = document.getElementById('cardInner');
    inner.style.transform = 'rotateY(' + target + 'deg)';
    var delay = firstDraw ? 300 : 500;
    setTimeout(function () { populateFront(result.item); }, delay);
    angle = target;
    firstDraw = false;
    document.getElementById('drawBtn').textContent = 'Draw another card';
    var countEl = document.getElementById('deckCount');
    if (result.reshuffled) {
      countEl.textContent = 'Deck reshuffled, ' + queue.length + ' cards up next';
    } else {
      countEl.textContent = queue.length + (queue.length === 1 ? ' card left in the deck' : ' cards left in the deck');
    }
  }

  document.getElementById('drawBtn').addEventListener('click', draw);
  document.getElementById('card').addEventListener('click', draw);

  try {
    var today = new Date().toISOString().slice(0, 10);
    var data = JSON.parse(localStorage.getItem('daisyCardStreak') || 'null') || { lastDate: null, streak: 0 };
    if (data.lastDate !== today) {
      var diffDays = data.lastDate ? Math.round((new Date(today) - new Date(data.lastDate)) / 86400000) : null;
      data.streak = diffDays === 1 ? data.streak + 1 : 1;
      data.lastDate = today;
      localStorage.setItem('daisyCardStreak', JSON.stringify(data));
    }
    document.getElementById('streakText').textContent = 'Day ' + data.streak + ' of gentle reminders';
  } catch (e) {}

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function () {});
    });
    var reloadedForUpdate = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (reloadedForUpdate) return;
      reloadedForUpdate = true;
      location.reload();
    });
  }
})();
