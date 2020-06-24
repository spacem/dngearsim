import { DntFiles } from 'src/values/dnt-files';
import { Job } from 'src/models/job';
import * as angular from 'angular';

angular.module('dnsim').factory('jobs', ['dntData', 'translations', 'itemColumnsToLoad', jobs]);
function jobs(dntData, translations, itemColumnsToLoad) {

  const fileName = DntFiles.job;
  const colsToLoad = itemColumnsToLoad.jobsDnt;

  return {
    fileName: fileName,
    allJobs: null as Job[],

    isLoaded: function () {
      return dntData.isLoaded(fileName);
    },

    hasStartedLoading: function () {
      return dntData.hasStartedLoading(fileName);
    },

    init: function (progress, complete) {
      return dntData.init(fileName, colsToLoad, progress, function () {
        if (complete) {
          complete();
        }
      }, false);
    },

    reset: function () {
      this.allJobs = null;
      dntData.reset(fileName);
    },

    getFinalJobs: function () {
      const retVal: Job[] = [];
      const alljobs: Job[] = this.getAllJobs();
      if (alljobs) {
        const numRows = alljobs.length;
        for (let r = 0; r < numRows; ++r) {
          if (Number(alljobs[r].d.JobNumber) === 2 && alljobs[r].d.JobIcon > 0) {
            retVal.push(alljobs[r]);
          }
        }
      }

      return retVal;
    },

    getBaseJobs: function () {
      const retVal: string[] = [];
      const baseJobs = {};

      for (const job of this.getFinalJobs()) {
        baseJobs[this.getBaseJobName(job)] = job;
      }

      for (const jobName of Object.keys(baseJobs)) {
        retVal.push(jobName);
      }

      return retVal;
    },

    getAllJobs: function () {
      if (this.allJobs == null && this.isLoaded() && translations.isLoaded()) {
        const gotJobs: Job[] = [];
        const data = dntData.getData(fileName);
        for (const d of data) {
          gotJobs.push(this.createJob(d));
        }
        this.allJobs = gotJobs;
      }
      return this.allJobs as Job[];
    },

    getById: function (id) {
      const data = this.getAllJobs();
      if (data) {
        const numRows = data.length;
        for (let r = 0; r < numRows; ++r) {
          if (data[r].id === id) {
            return data[r];
          }
        }
      }
    },

    createJob: function (d) {
      const t = this;
      return {
        d: d,
        id: d.id,
        name: translations.translate(d.JobName),
        isClassJob: function (c) {
          return t.isClassJob(d, c);
        }
      };
    },

    isClassJob: function (d, c) {
      if (!c) {
        return true;
      }
      if (d.id === c) {
        return true;
      }

      const parentJob = d.ParentJob;

      if (!parentJob) {
        return false;
      }
      if (parentJob === c) {
        return true;
      }

      const parentJobData = this.getById(parentJob);
      if (parentJobData) {
        return this.isClassJob(parentJobData.d, c);
      }

      return false;
    },

    getBaseJobName: function (job) {
      if (this.isLoaded()) {
        const alljobs = this.getAllJobs();
        if (alljobs) {
          const numRows = alljobs.length;
          for (let r = 0; r < numRows; ++r) {
            const j = alljobs[r].d;
            if (Number(j.BaseClass) === Number(job.d.BaseClass) &&
              Number(j.JobNumber) === 0 &&
              j.EnglishName) {
              return j.EnglishName;
            }
          }
        }
      }

      return null;
    },
  };
}
