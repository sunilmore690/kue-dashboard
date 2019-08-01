<template>
  <div>
    <el-row>
      <el-col :span="4" :sm="4">
        <el-tabs tab-position="left" style="height: 200px;" role="tabs" @tab-click="handleClick">
          <el-tab-pane label="all">All</el-tab-pane>
          <el-tab-pane v-for="type in jobtypes" :label="type" :key="type"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="20" :sm="20">
        <el-row style="padding-bottom:10px">
          <el-col :offset="19" :sm="5">
            <el-input
              placeholder="Please input"
              v-model="search"
              class="input-with-select"
              @keyup.enter.native="searchJob"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchJob"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-tabs type="border-card" v-model="activeTab">
          <el-tab-pane name="inactive">
            <span slot="label">
              <el-badge :value="stats.inactiveCount" class="item" type="info">Queued</el-badge>
            </span>
            <JobList status="inactive" :count="stats.inactiveCount" :jobtype="jobtype" />
          </el-tab-pane>
          <el-tab-pane name="active">
            <span slot="label">
              <el-badge :value="stats.activeCount" class="item" type="primary">Active</el-badge>
            </span>
            <JobList status="active" :count="stats.activeCount" :jobtype="jobtype" />
          </el-tab-pane>
          <el-tab-pane name="failed">
            <span slot="label">
              <el-badge :value="stats.failedCount" class="item" type="danger">Failed</el-badge>
            </span>
            <JobList status="failed" :count="stats.failedCount" :jobtype="jobtype" />
          </el-tab-pane>
          <el-tab-pane name="complete">
            <span slot="label">
              <el-badge :value="stats.completeCount" class="item" type="success">Complete</el-badge>
            </span>
            <JobList status="complete" :count="stats.completeCount" :jobtype="jobtype" />
          </el-tab-pane>
          <el-tab-pane name="delayed">
            <span slot="label">
              <el-badge :value="stats.delayedCount" class="item" type="warning">Delayed</el-badge>
            </span>
            <JobList status="delayed" :count="stats.delayedCount" :jobtype="jobtype" />
          </el-tab-pane>
          <el-tab-pane name="searchresults">
            <span slot="label">
              <el-badge :value="results.length" class="item" type="primary">Search Results</el-badge>
            </span>
            <List :jobs="results" v-loading="loading" status="searchresults" :jobtype='jobtype' />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import JobList from "./JobList";
import List from "./List";
import crud from "@/crud.js";

export default {
  data() {
    return {
      stats: {},
      search: "",
      results: [],
      activeTab: "active",
      loading: false,
      jobtypes: [],
      jobtype: "all"
    };
  },
  components: {
    List,
    JobList
  },
  methods: {
    handleClick(tab, even) {
      console.log("tab", this.jobtype);
      this.jobtype = tab.label;
      this.fetchData();
    },
    getTagType(state) {
      if (state == "complete") {
        return "success";
      } else if (state == "failed") {
        return "danger";
      } else if (state == "active") {
        return "";
      } else if (state == "delayed") {
        return "warning";
      } else if (state == "inactive") {
        return "info";
      }
    },
    async fetchData() {
      console.log('this',this.jobtype)
      if (this.jobtype == "all") {
        this.stats = await crud.get("/stats");
      } else {
        ["inactive", "active", "failed", "delayed", "complete"].forEach(
          async state => {
           
            let data = await crud.get(`/jobs/${this.jobtype}/${state}/stats`);
            this.stats[state + "Count"] = data.count;
          }
        );
      }
    },
    async searchJob() {
      this.loading = true;
      this.activeTab = "searchresults";
      this.results = [];
      this.jobids = await crud.get("/job/search", { q: this.search });
      this.results = [];
      this.jobids.forEach(async id => {
        this.results.push(await crud.get("/job/" + id));
      });
      this.loading = false;
    }
  },
  async created() {
    this.fetchData();
    let interval = setInterval(() => {
      this.fetchData();
    }, 3000);
    this.jobtypes = await crud.get("/job/types/");
  }
};
</script>
<style>
.el-tabs__nav {
  margin-top: 10px;
}
</style>

