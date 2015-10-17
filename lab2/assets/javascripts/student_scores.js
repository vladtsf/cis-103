window.StudentScoreCalculator = (function() {

  var Student = (function () {
    var _lastId = 0

    var Student = function (lastName, firstName, score) {
      this.id = _lastId++;
      this.lastName = lastName;
      this.firstName = firstName;
      this.score = parseInt(score);
    };

    Student.prototype.toString = function() {
      return [
        [this.lastName, this.firstName].join(", "),
        this.score
      ].join(": ");
    };

    Student.getAverageScore = function (students) {
      if(students.length) {
        return students
          .map(function(student) { return student.score; })
          .reduce(function(prev, curr) { return prev + curr; }) / students.length;
      }
    };

    Student.lastNameComparator = function (l, r) {
      if(l.lastName == r.lastName) {
        return 0;
      }

      return l.lastName < r.lastName ? -1 : 1;
    };

    return Student;
  })();


  var StudentScoreCalculator = function($block) {
    var $elements, students = [];

    var self = {
      bindEvents: function() {
        $elements.$form.addEventListener("submit", this.onSubmit.bind(this));
        $elements.$sort.addEventListener("click", this.sort.bind(this));
        $elements.$reset.addEventListener("click", this.reset.bind(this));
      },

      addStudent: function() {
        var lastName = $elements.$lastName.value;
        var firstName = $elements.$firstName.value;
        var score = $elements.$score.value;

        students.push(new Student(lastName, firstName, score));
      },

      sort: function() {
        students = students.sort(Student.lastNameComparator);
        this.render();
      },

      reset: function () {
        students = []
        this.render();
      },

      onSubmit: function(e) {
        e.preventDefault();
        this.addStudent();
        this.render();
      },

      render: function() {
        var text = students.join("\n");
        var score = Student.getAverageScore(students);

        $elements.$average.value = typeof score != "undefined" ? score.toFixed(1) : "";
        $elements.$output.value = text;
      }
    };

    this.init = function () {
      $elements = {
        $form: $block.querySelector(".js-calculator__form"),
        $sort: $block.querySelector('.js-sort'),
        $reset: $block.querySelector('.js-reset'),
        $output: $block.querySelector('.js-output'),
        $lastName: $block.querySelector('[name=last_name]'),
        $firstName: $block.querySelector('[name=first_name]'),
        $score: $block.querySelector('[name=score]'),
        $average: $block.querySelector('[name=average_score]')
      }

      self.bindEvents();
    };
  };


  return StudentScoreCalculator;
})();