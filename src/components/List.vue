<template>
  <div v-if="jobs && jobs.length">
    <el-collapse v-model="activeName" accordion @change="loadLog">
      <job
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        :logsync="status=='active'?true:false"
        :showstate="status=='searchresults'?true:false"
        :showtype="jobtype == 'all'?true:false"
        v-on="$listeners"
      ></job>
    </el-collapse>
  </div>
  <div v-else>No Jobs</div>
</template>
<script>
import crud from "@/crud";
import Job from "./Job";
export default {
  props: ["jobs", "status", "jobtype"],
  data() {
    return {
      logs: [],
      loading: false,
      activeName: "",
      showByIndex: null,
      // myjobs:[],
    };
  },
  computed: {
    log() {
      return this.logs.join("/n");
    },
    
    
  },
  methods: {
    async updateState(id, state) {
      //  http://optportal-node.optcentral.com/job/133/state/failed
      await crud.put(`/job/${id}/state/${state}`);
      this.jobs = this.jobs.fiter(job => {
        return job.id != id;
      });
    },

    loadLog(id) {
      // this.logs = [];
      // this.getLog(id);
    }
  },

  components: {
    Job
  }
};
</script>


<style >
.el-progress__text {
  font-size: x-small !important;
}
</style>

