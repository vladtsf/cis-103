(function () {

  function getSorter(field) {
    var parseValue = function(item) {
      return ~~parseFloat($("td", item).eq(field).text().replace(/\$|\,/g, ""));
    }

    return function(l, r) {
      l = parseValue(l);
      r = parseValue(r);

      return l - r;
    }
  }


  var SortQuarterlyReportView = function ($block) {
    this.init($block);
    this.bindEvents();
  };

  SortQuarterlyReportView.prototype = new VTFramework.View();

  SortQuarterlyReportView.prototype.elements = {
    body: ".js-report__body",
    items: ".js-report__sortable-item",
    sorters: ".js-sort"
  };

  SortQuarterlyReportView.prototype.sortItems = function(e) {
    var field = $(e.target).closest("th").index();
    var sorted;

    if(field !== 0) {
      sorted = this.elements.items.sort(getSorter(field));
      this.elements.body.append(sorted);
    }

  };

  SortQuarterlyReportView.prototype.bindEvents = function() {
    var self = this;

    this.$block.on("click", ".js-sort", this.sortItems.bind(this));
  };

  window.AppView = SortQuarterlyReportView;
})();