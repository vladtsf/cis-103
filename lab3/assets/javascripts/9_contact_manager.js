(function () {

  // function padLeft(str, len) {
  //   return [new Array(len + 1).join(" "), str].join("");
  // }

  function padRight(str, len) {
    return [str, new Array(Math.max(len - String(str).length + 1, 0)).join(" ")].join("");
  }

  function formatRow(id, name, phone, email) {
    var res = [];

    res.push(padRight(id, 2));
    res.push(padRight(name, 25));
    res.push(padRight(phone, 12));
    res.push(padRight(email, 25));

    return res.join("  ");
  }

  function getCookieData() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)_contacts\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  }

  var ContactModel = function(name, phone, email, id) {
    this.id = id || ++ContactModel._lastId;
    this.name = name;
    this.phone = phone;
    this.email = email;
  };

  ContactModel._lastId = 0;

  ContactModel.fromJSON = function(data) {
    return new ContactModel(data.name, data.phone, data.email, data.id);
  };

  ContactModel.prototype.isValid = function() {
    return this.name && this.phone && this.email;
  };

  ContactModel.prototype.toJSON = function() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email
    };
  };

  ContactModel.prototype.toString = function() {
    return formatRow(this.id + ":", this.name, this.phone, this.email);
  };


  var ContactCollection = function () {
    this.contacts = [];
  };

  ContactCollection.fromJSON = function (data) {
    var col = new ContactCollection();

    ContactModel._lastId = data.last_id;

    col.contacts = data.contacts.map(function (c) {
      return ContactModel.fromJSON(c);
    });

    return col;
  };

  ContactCollection.prototype.toJSON = function() {
    return {
      last_id: ContactModel._lastId,
      contacts: this.contacts.map(function(c) {
        return c.toJSON();
      })
    };
  };

  ContactCollection.prototype.add = function(contact) {
    this.contacts.push(contact);
  };

  ContactCollection.prototype.get = function(id) {
    for (var i = this.contacts.length - 1; i >= 0; i--) {
      if(this.contacts[i].id == id) {
        return this.contacts[i];
      }
    };

    return null;
  };

  ContactCollection.prototype.remove = function(id) {
    this.contacts = this.contacts.filter(function (c) {
      if(c.id == id) {
        return false;
      }

      return true;
    });
  };

  ContactCollection.prototype.toString = function() {
    return [
      formatRow("#", "Name", "Phone", "Email"),
      new Array(71).join("-"),
      this.contacts.join("\n")


    ].join("\n");
  };

  var ContactManagerView = function ($block) {
    var saved = getCookieData();

    if(saved) {
      this.model = ContactCollection.fromJSON(JSON.parse(decodeURIComponent(saved)));
    } else {
      this.model = new ContactCollection();
    }

    this.init($block);
    this.bindEvents();
  };

  ContactManagerView.prototype = new VTFramework.View();

  ContactManagerView.prototype.elements = {
    picker: ".js-contact-picker",
    name: ".js-name",
    phone: ".js-phone",
    email: ".js-email",
    output: ".js-output"
  };

  ContactManagerView.prototype.serialize = function() {
    return {
      name: this.elements.name.val(),
      phone: this.elements.phone.val(),
      email: this.elements.email.val()
    };
  };

  ContactManagerView.prototype.save = function(e) {
    document.cookie = "_contacts=" + encodeURIComponent(JSON.stringify(this.model.toJSON())) + ";expires=" + new Date(Date.now() + 31536000000);
  };

  ContactManagerView.prototype.add = function(e) {
    var d = this.serialize();

    var contact = new ContactModel(d.name, d.phone, d.email);

    if(contact.isValid()) {
      this.model.add(contact);
    }

    this.render();
    this.save();
  };

  ContactManagerView.prototype.edit = function(e) {
    var d = this.serialize();

    var contact = this.model.get(this.elements.picker.val());

    if(contact && d.name && d.phone && d.email) {
      contact.name = d.name;
      contact.phone = d.phone;
      contact.email = d.email;

      this.render();
      this.save();
    }
  };

  ContactManagerView.prototype.remove = function(e) {
    var id = this.elements.picker.val();

    this.model.remove(id);
    this.render();
    this.save();
  };

  ContactManagerView.prototype.prepopulate = function(e) {
    this.picked = this.model.get(e.target.value);

    if(this.picked) {
      this.elements.name.val(this.picked.name);
      this.elements.phone.val(this.picked.phone);
      this.elements.email.val(this.picked.email);
    }
  };


  ContactManagerView.prototype.bindEvents = function() {
    var self = this;

    this.$block.on("click", ".js-add", this.add.bind(this));
    this.$block.on("click", ".js-edit", this.edit.bind(this));
    this.$block.on("click", ".js-delete", this.remove.bind(this));
    this.$block.on("change", ".js-contact-picker", this.prepopulate.bind(this));
  };

  ContactManagerView.prototype.renderPicker = function() {
    var self = this;

    if(this.model.contacts.length === 0) {
      this.elements.picker
        .attr("disabled", true)
        .html("<option>Empty</option>")
    } else {
      this.elements.picker
        .attr("disabled", false)
        .html(
          "<option>Pick Contact</option>" +
          this.model.contacts.map(function (c) {
            console.log()
            return "<option " + (self.picked && self.picked.id == c.id ? "selected " : "") + " value='" + c.id + "'>" + c.name + "</option>";
          }).join("")
        )
    }
  };

  ContactManagerView.prototype.render = function() {
    this.renderPicker();

    this.elements.output.html(this.model.contacts.length ? String(this.model) : "There are no contacts to display");
  };

  window.AppView = ContactManagerView;
})();