<template>
  <el-collapse-item :key="job.id" :name="job.id">
    <template slot="title">
      <div>
        <el-tag type="info">{{job.id}}</el-tag>&nbsp;
        <el-tag v-if="showtype">{{job.type}}</el-tag>&nbsp;&nbsp;
        <span
          style="font-weight: 800; font-style: initial; font-size: medium;"
        >{{job.data.title}}</span>

        <span style="position:absolute;right:5%;top:6px;display:flex">
          <el-progress
            v-if="job.state =='active'"
            :width="40"
            :stroke-width="3"
            type="circle"
            :percentage="parseInt(job.progress+'')"
          ></el-progress>
          <el-tag v-if="showstate" :type="getTagType(job.state)">{{job.state}}</el-tag>
        </span>
      </div>
    </template>
    <el-row>
     <el-col :span="24" :xs="24">
        <b>State:</b>
        <el-select v-model="job.state" size="mini" placeholder="Select" @change="updateState">
          <el-option
            v-for="state in states"
            :key="state.value"
            :label="state.name"
            :value="state.value"
          ></el-option>
        </el-select>
        <div>
          <br />

          <el-popover placement="top" width="160" v-model="visible">
            <p>Are you sure to delete this?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible=false;">cancel</el-button>
              <el-button type="primary" size="mini" @click="deleteJob();visible = false">confirm</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">Delete</el-button>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="24" :xs="24">
        <div style="text-align:left;font-size:medium">
          <div v-if="job.state == 'complete'">
            <span>
              <b>Duration</b>
            </span>
            : {{job.duration | readableDuration}}
          </div>
          <div>
            <span>
              <b>Created</b>
            </span>
            : {{job.created_at | humenDate}}
          </div>
          <div v-if="job.state == 'complete'">
            <span>
              <b>Completed</b>
            </span>
            : {{job.updated_at | humenDate}}
          </div>
          <div class="info">
              <div v-for="(value, propertyName) in job.data" :key="propertyName">
                <b>{{propertyName}}</b>: {{value}}    
              </div>
          </div>
        </div>
      </el-col>
     
    </el-row>

    <el-divider v-if="job.state=='failed'"></el-divider>
    <div v-if="job.state=='failed'">
      <h3>Error</h3>
      <span v-html="job.error.split('\n').join('<br>')+''"></span>
    </div>
    <el-divider></el-divider>
    <el-button type="warning" @click="getLog" size="mini">See Log</el-button>

    <div style="overflow-y:auto" :id="'log'+job.id">
      <div style="min-height:50px;max-height:500px;text-align:left;font-size:medium">
        <div v-if="loading">Loading logs ...</div>
        <div v-else v-for="(log,index) in logs" :key="'log'+index">{{log}}</div>
      </div>
    </div>
  </el-collapse-item>
</template>
<script>
import crud from "@/crud";
export default {
  props: ["job", "logsync", "showstate", "showtype", "activeName"],
  data() {
    return {
      visible: false,
      logs: [],
      loading:false,
      states: [
        {
          name: "Queued",
          value: "inactive"
        },
        {
          name: "Active",
          value: "active"
        },
        {
          name: "Failed",
          value: "failed"
        },
        {
          name: "Delayed",
          value: "delayed"
        },
        {
          name: "Complete",
          value: "complete"
        }
      ]
    };
  },
  watch: {
    activeName(oldvalue, newvalue) {
      console.log("oldvalue", oldvalue);
      console.log("newvalue", newvalue);
    }
  },
  beforeDestroy() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  },
  methods: {
    async deleteJob() {
      await crud.delete(`/job`, this.job.id);
      this.$emit("destroyjob", this.job.id);
    },
    changeState(id) {
      console.log("id", id);
    },
    async updateState(state) {
      const id = this.job.id;
      //  http://optportal-node.optcentral.com/job/133/state/failed
      await crud.put(`/job/${id}/state/${state}`);
      this.$emit("destroyjob", this.job.id);
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
    scrollToEnd: function(elName) {
      var container = this.$el.querySelector(elName);
      container.scrollTop = container.scrollHeight;
    },
    async getLog() {
        this.loading = true;
      const id = this.job.id;
      //   this.loading = true;
      //    this.logs = [];
      let logs = await crud.get(`/job/${id}/log`);
      this.loading = false;
      let newlogs = logs.slice(this.logs.length);

      console.log("newlogs", newlogs);
      this.logs.push(...newlogs);
      this.scrollToEnd("#log" + id);
      if (this.logsync && !this.interval) {
        this.interval = setInterval(() => {
          this.getLog();
        }, 5000);
      }
      //   if
      //   this.loading = false;
    }
  }
};
</script>
<style>
.el-collapse-item__header {
  position: relative;
}
</style>


                                             