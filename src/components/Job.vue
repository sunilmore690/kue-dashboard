<template>
  <el-collapse-item >
     <template slot="title">
          <el-tag type="info">{{job.id}}</el-tag>&nbsp;
          <el-tag v-if="jobtype == 'all'">{{job.type}}</el-tag>&nbsp;&nbsp;
          <span
            style="font-weight: 800; font-style: initial; font-size: medium;"
          >{{job.data.title}}</span>

          <span style="position:absolute;right:5%">
            <el-tag v-if="status == 'searchresults'" :type="getTagType(job.state)">{{job.state}}</el-tag>
            <el-progress
              v-if="status=='active'"
              :width="40"
              :stroke-width="3"
              style="margin-top:40%"
              type="circle"
              :percentage="parseInt(job.progress+'')"
            ></el-progress>
          </span>
          <el-button
           v-show="job.showicon"
            type="danger"
            circle
            size="mini"
            style="position:absolute;margin-top:-25px;left:98%"
          >
            <i class="el-icon-close"></i>
          </el-button>
        </template>
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
            : {{job.promote_at | humenDate}}
          </div>
        </div>

        <el-divider v-if="job.status=='failed'"></el-divider>
        <div v-if="job.status=='failed'"><b>{{{job.error.split('\n').join('<br>')}}</b></div>
        <el-divider></el-divider>
        <div style="overflow-y:auto" :id="'log'+job.id">
          <div style="min-height:50px;max-height:500px;text-align:left;font-size:medium" >
            <div v-if="logs.length == 0">Loading logs ...</div>
            <div v-else v-for="(log,index) in logs" :key="'log'+index">{{log}}</div>
          </div>
        </div>
 </el-collapse-item>
</template>
<script>
import crud from "@/crud";
export default {
    props:['job','index','status','jobtype'],
    data(){
        return {
              logs: [],
        }
    },
    watch:{
        activeName(oldvalue,newvalue){
            this.loadLog(newvalue)
        }
    },
    methods:{
         scrollToEnd: function(elName) {    	
      var container = this.$el.querySelector(elName);
      container.scrollTop = container.scrollHeight;
    },
    loadLog(id) {
      this.logs = [];
      this.getLog(id);
    },
    async getLog(id) {
      //   this.loading = true;
      //    this.logs = [];
      let logs = await crud.get(`/job/${id}/log`);
      let newlogs = logs.slice(this.logs.length);

      console.log("newlogs", newlogs);
      newlogs.forEach(log => {
        this.logs.push(log);
      });
      this.scrollToEnd('#log'+id)
      //   if
      //   this.loading = false;
    }
    },
    created(){
         if (this.status == "active") {
      setInterval(() => {
        if (this.activeName == this.job.id) {
          this.getLog(this.activeName);
        }
      }, 5000);
    }
    }
};
</script>
