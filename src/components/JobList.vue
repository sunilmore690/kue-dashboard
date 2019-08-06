<template>
  <el-row v-loading="loading">
    <el-radio v-model="sort" label="desc" @change="fetchData">Sort By Latest Jobs</el-radio>
    <el-radio v-model="sort" label="asc" @change="fetchData">Sort by last Jobs</el-radio>
    <el-button type circle icon="el-icon-refresh" @click="fetchData"></el-button>
    <el-col :sm="24" style="padding-top:20px">
      <List :jobs="jobs" :status='status' :jobtype='jobtype' @destroyjob='deleteJob'/>

      <el-pagination
        layout="prev, pager, next"
        :total="count"
        :size="limit"
        @current-change="handlePageChange"
      ></el-pagination>
    </el-col>
  </el-row>
</template>
<script>
import crud from "@/crud.js";
import List from "./List";
export default {
  props: ["status", "count","jobtype"],
  data() {
    return {
      loading: false,
      jobs: [],
      activeName: "",
      page: 1,
      limit: 10,
      sort: "desc"
    };
  },
  methods: {
    deleteJob(id){
      this.jobs = this.jobs.filter(job=>job.id!=id)
    },
    handlePageChange(page) {
      this.page = page;
      this.fetchData();
    },
    async fetchData() {
      if(!['active','inactive'].includes(this.status))    this.loading = true;
     
      let start = this.page * this.limit - this.limit;
      let end = this.page * this.limit;
      let url =  `/jobs/${this.status}/${start}..${end}/${this.sort}`
      console.log('jobtype',this.jobtype)
      if(this.jobtype !== 'all'){
          url = `/jobs/${this.jobtype}/${this.status}/${start}..${end}/${this.sort}`
      }
      try {
        this.jobs = await crud.get(
         url
        );
        
        console.log("", this.jobs.length);
      } catch (e) {
        console.log("error", e.message);
      } finally {
        this.loading = false;
      }
    }
  },
  watch:{
    jobtype:function(newvalue,oldvalue){
      console.log('newvalue',newvalue)
      console.log('oldvalue',oldvalue)
      this.fetchData()
    }
  },
  created() {
    if (this.status == "active" || this.status == 'inactive') {
      setInterval(() => {
        this.fetchData();
      }, 6000);
    }

    this.fetchData();
  },
  components: {
    List
  }
};
</script>
