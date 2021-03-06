(function () {
  'use strict';

  angular.module('dnsim').directive('dnsimChooseClass', chooseClass);

  function chooseClass() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        job: '=job',
        onSetJob: '&onSetJob'
      },
      template: require('!raw-loader!./choose-class.html').default,
      controllerAs: 'ctrl',
      controller: [
        '$timeout', 'jobs',
        chooseClassController],
    };
  }

  function chooseClassController($timeout, jobs) {
    this.getFinalJobs = function () {
      var allJobs = jobs.getFinalJobs();
      var finalJobs = [];
      for (var j = 0; j < allJobs.length; ++j) {
        if (jobs.getBaseJobName(allJobs[j]) == this.bJob) {
          finalJobs.push(allJobs[j]);
        }
      }
      return finalJobs;
    }

    this.getBaseJobs = function () {
      return jobs.getBaseJobs();
    }

    this.getJobName = function (englishName) {
      var allJobs = jobs.getAllJobs();
      for (var j = 0; j < allJobs.length; ++j) {
        if (allJobs[j].d.EnglishName == englishName) {
          return allJobs[j].name;
        }
      }
    }

    this.setJob = function (job) {
      this.job = job;
      if (job) {
        this.onSetJob();
      }
    }

    this.$onInit = () => {
      jobs.init(reportProgress, $timeout);
    }

    function reportProgress(msg) {
      // console.log('progress: ' + msg);
    }

  }

})();
