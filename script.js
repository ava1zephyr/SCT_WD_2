class Stopwatch {
  constructor() {
    this.startTime = 0;
    this.elapsed = 0;
    this.timer = null;
    this.running = false;
    this.laps = [];

    this.getEls();
    this.loadTheme();
    this.bindEvents();
  }
  getEls() {
    this.display = document.getElementById('time');
    this.btnStartPause = document.getElementById('btnStartPause');
    this.btnReset = document.getElementById('btnReset');
    this.btnLap = document.getElementById('btnLap');
    this.lapsSection = document.getElementById('lapsSection');
    this.lapsList = document.getElementById('lapsList');
    this.lapsEmpty = document.getElementById('lapsEmpty');
    this.btnClearLaps = document.getElementById('btnClearLaps');
    this.themeBtn = document.getElementById('toggleTheme');
  }

  bindEvents() {
    const bindings = [
      [this.btnStartPause, this.toggle],
      [this.btnReset, this.reset],
      [this.btnLap, this.addLap],
      [this.btnClearLaps, this.clearLaps],
      [this.themeBtn, this.toggleTheme]
    ];

    bindings.forEach(([el, handler]) => {
      el.addEventListener('click', handler.bind(this));
    });
  }

  format(ms) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const msPart = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}:${msPart.toString().padStart(2,'0')}`;
  }

  update() {
    if (this.running) {
      this.elapsed = performance.now() - this.startTime;
    }
    this.display.textContent = this.format(this.elapsed);
  }

  toggle() {
    this.running ? this.pause() : this.start();
  }

  start() {
    this.startTime = performance.now() - this.elapsed;
    this.timer = setInterval(() => this.update(), 10);
    this.running = true;
    this.btnStartPause.textContent = 'Pause';
    this.btnStartPause.classList.add('warning');
    this.btnLap.disabled = false;
  }

  pause() {
    clearInterval(this.timer);
    this.running = false;
    this.btnStartPause.textContent = 'Resume';
    this.btnStartPause.classList.remove('warning');
  }

  reset() {
    clearInterval(this.timer);
    this.running = false;
    this.elapsed = 0;
    this.update();
    this.btnStartPause.textContent = 'Start';
    this.btnStartPause.classList.remove('warning');
    this.btnLap.disabled = true;
    this.clearLaps();
  }

  addLap() {
    if (!this.running) return;
    const lastLap = this.laps[this.laps.length - 1];
    const split = lastLap ? this.elapsed - lastLap.time : this.elapsed;
    this.laps.push({ time: this.elapsed, split });
    this.renderLaps();
  }

  renderLaps() {
    this.lapsList.innerHTML = '';
    [...this.laps].reverse().forEach((lap, i) => {
      const div = document.createElement('div');
      div.className = 'lap';
      div.innerHTML = `
        <span>Lap ${this.laps.length - i}</span>
        <span>+${this.format(lap.split)}</span>
        <span>${this.format(lap.time)}</span>
      `;
      this.lapsList.appendChild(div);
    });
    this.lapsSection.classList.remove('hidden');
    this.lapsEmpty.style.display = this.laps.length ? 'none' : 'block';
  }

  clearLaps() {
    this.laps = [];
    this.lapsList.innerHTML = '';
    this.lapsSection.classList.add('hidden');
    this.lapsEmpty.style.display = 'block';
  }

  loadTheme() {
    const theme = localStorage.getItem('stopwatch-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('stopwatch-theme', next);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Stopwatch();
});
