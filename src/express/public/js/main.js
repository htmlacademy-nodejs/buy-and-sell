'use strict';

(function() {
  var deletEls = document.querySelectorAll('.js-delete');
  for (var i = 0; i < deletEls.length; i++) {
    deletEls[i].addEventListener('click', function() {
      var card = this.closest('.js-card');
      card.parentNode.removeChild(card);

    })
  }
})();

'use strict';

(function () {
  var form = document.querySelector('.form');

  if (form) {
    var formFields = form.querySelectorAll('.js-field');
    var formButton = form.querySelector('.js-button');

    var setFillField = function (field) {
      if (field.value) {
        field.parentNode.classList.add('form__field--fill');
      } else {
        field.parentNode.classList.remove('form__field--fill');
      }
      field.addEventListener('focus', function () {
        field.parentNode.classList.add('form__field--focus');
      });
      field.addEventListener('blur', function () {
        field.parentNode.classList.remove('form__field--focus');
      });
    };

    var getFillFields = function () {
      var fill = true;
      for (var i = 0; i < formFields.length; i++) {
        if (!formFields[i].value) {
          fill = false;
          break;
        }
      }
      return fill;
    };

    Array.prototype.slice.call(formFields).forEach(function (field) {
      setFillField(field);
    });

    Array.prototype.slice.call(formFields).forEach(function (field) {
      field.addEventListener('input', function () {
        setFillField(field);
        if (formButton) {
          if (getFillFields()) {
            formButton.removeAttribute('disabled');
          } else {
            formButton.setAttribute('disabled', 'disabled');
          }
        }
      });
    });

    var selects = document.querySelectorAll('.js-multiple-select');
    for (var i = 0; i < selects.length; i++) {
      var placeholder = selects[i].getAttribute('data-label');
      var SS = new Selectr(selects[i], {
        searchable: false,
        multiple: true,
        width: 222,
        placeholder: placeholder
      });
      var selection = Selectr.prototype.select,
        deselection = Selectr.prototype.deselect;
      var ours = document.createElement('div');
      ours.className = SS.selected.className;
      SS.selected.className += ' selectr-selected--hidden';
      SS.selected.parentNode.insertBefore(ours,SS.selected);
      var updateOurs = function(){
        ours.innerText = SS.selected.innerText.trim().replace(/\n/g, ', ') || placeholder;
      };
      Selectr.prototype.select = function(){
        selection.apply(this, arguments);
        updateOurs();
      };

      Selectr.prototype.deselect = function(){
        deselection.apply(this, arguments);
        updateOurs();
      };
      updateOurs();
    }

    var priceField = form.querySelector('.js-price');
    if (priceField) {
      priceField.addEventListener('keydown', function(e) {
        if (window.event.keyCode >= 65 && window.event.keyCode <= 90 || window.event.keyCode === 189 || window.event.keyCode === 188) {
          e.preventDefault();
        }
        if (window.event.keyCode === 190 && (!priceField.value || priceField.value.includes('.'))) {
          e.preventDefault();
        }
      })
    }
  }

})();

'use strict';

(function () {
  var signUpAvatarContainer = document.querySelector('.js-preview-container');

  if (signUpAvatarContainer) {
    var signUpFieldAvatarInput = signUpAvatarContainer.querySelector('.js-file-field');
    var signUpAvatar = signUpAvatarContainer.querySelector('.js-preview');

    var readFilePhoto = function (file) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var image = document.createElement('img');
        image.src = reader.result;
        signUpAvatar.innerHTML = '';
        signUpAvatar.appendChild(image);
      });
      reader.readAsDataURL(file);
    };

    signUpFieldAvatarInput.addEventListener('change', function () {
      var file = signUpFieldAvatarInput.files[0];
      readFilePhoto(file);
      signUpAvatarContainer.classList.add('uploaded');
    });
  }
})();

'use strict';

(function () {
  svg4everybody();
})();

'use strict';

(function () {
  var search = document.querySelector('.search');

  if (search) {
    var searchInput = search.querySelector('.search input');
    var searchCloseButton = search.querySelector('.search__close-btn');

    if (searchInput.value) {
      search.classList.add('search--active');
      searchCloseButton.classList.add('search__close-btn--active');
    } else {
      search.classList.remove('search--active');
      searchCloseButton.classList.remove('search__close-btn--active');
    }

    searchInput.addEventListener('change', function () {
      if (searchInput.value) {
        search.classList.add('search--active');
      } else {
        search.classList.remove('search--active');
      }
    });

    searchInput.addEventListener('input', function () {
      if (searchInput.value) {
        searchCloseButton.classList.add('search__close-btn--active');
      } else {
        searchCloseButton.classList.remove('search__close-btn--active');
      }
    });

    searchCloseButton.addEventListener('click', function () {
      searchCloseButton.classList.remove('search__close-btn--active');
      searchInput.value = '';
      search.classList.remove('search--active');
    });
  }
})();

//# sourceMappingURL=main.js.map
