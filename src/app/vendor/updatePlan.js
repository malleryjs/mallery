export const createUpdatePlan =  function() {
  let store = {
    items: [],
    data: [],
  };

  let data;

  let plan = function(el, updateFn) {
    if (typeof el === "function") {
      return el.call(this, plan);
    } else {
      if (updateFn) {
        this.items.push({
          node: el,
          updateFn: updateFn
        });
      }
      return el;
    }
  }

  plan = plan.bind(store);
  plan.run = function() {
    var self = this;
    self.data = arguments;

    store.items.forEach(function(item) {
      item.updateFn.apply(item.node, self.data);
    });
  }
  plan.getData = function() {
    return this.data;
  }

  return plan;
};

export default createUpdatePlan;
