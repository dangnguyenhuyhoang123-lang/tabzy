function Tabzy(tab_id, options = {}) {
  this.container = document.querySelector(tab_id);
  if (!this.container) {
    console.error("Not exists");
    return;
  }
  this.tabs = Array.from(this.container.querySelectorAll("li a"));
  if (!this.tabs.length) {
    console.error("No tab");
    return;
  }
  let hasError = false;
  this.panels = this.tabs
    .map((tab) => {
      const panel = document.querySelector(tab.getAttribute("href"));
      if (!panel) {
        console.error("panel not exists");
        hasError = true;
        return;
      }
      return panel;
    })
    .filter(Boolean);
  if (this.tabs.length !== this.panels.length) return;

  this.opt = Object.assign(
    {
      remember: false,
    },
    options
  );

  this._originHTML = this.container.innerHTML;
  this._init();
  //   this.destroy();
}
Tabzy.prototype._init = function () {
  let tabToActive = null;
  //   const savedTab = localStorage.getItem("tabzy--active"); ==> su dung localStorage
  const savedTab = location.hash;
  if (savedTab && this.opt.remember) {
    tabToActive =
      this.tabs.find((tab) => {
        return savedTab === tab.getAttribute("href");
      }) || this.tabs[0];
  } else tabToActive = this.tabs[0];
  this._activeTab(tabToActive);
  //   tabActive.closest("li").classList.add("tabzy--active");

  this.tabs.forEach((tab) => {
    tab.onclick = (event) => this._handleTabClick(event, tab);
  });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
  event.preventDefault();

  this._activeTab(tab);
};

Tabzy.prototype._showPanel = function (panel) {
  panel.hidden = false;
};
Tabzy.prototype._hiddenPanels = function () {
  this.panels.forEach((panel) => (panel.hidden = true));
};

Tabzy.prototype.switchTab = function (tab) {
  tab.closest("li").classList.add("tabzy--active");
};
Tabzy.prototype.destroy = function () {
  this.panels.forEach((panel) => (panel.hidden = false));
  //Tra ul ve code goc de khog xu ly active
  this.container.innerHTML = this._originHTML;

  this.container = null;
  this.tabs = null;
  this.panels = null;
};

Tabzy.prototype._activeTab = function (tab) {
  this.tabs.forEach((tab) => {
    tab.closest("li").classList.remove("tabzy--active");
  });

  //   tab.closest("li").classList.add("tabzy--active");
  this.switchTab(tab);
  //   this.panels.forEach((panel) => (panel.hidden = true));
  this._hiddenPanels();

  const panelActive = document.querySelector(tab.getAttribute("href"));
  //   panelActive.hidden = false;
  this._showPanel(panelActive);

  //   localStorage.setItem("tabzy--active", tab.getAttribute("href"));
  // Su dung localStorage de luu Active ( nhuoc diem : chi co the luu gia tri active tren chinh trinh duyet)
  console.log(tab);
  if (this.opt.remember)
    history.replaceState(null, null, tab.getAttribute("href"));
};

Tabzy.prototype.switch = function (input) {
  let tabToActive = null;
  if (typeof input === "string") {
    tabToActive = this.tabs.find((tab) => {
      return input === tab.getAttribute("href");
    });
    if (!tabToActive) {
      console.error("Tab not exists");
      return;
    }
  } else if (this.tabs.includes(input)) {
    tabToActive = input;
  }
  if (!tabToActive) {
    console.error("tabzy :Invalid input");
    return;
  }
  this._activeTab(tabToActive);
};
