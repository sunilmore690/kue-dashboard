// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.filter('trim',(str,n)=>{
  if(str.length > n){
    return str.substr(0,n) + '...'
  }
  return str;
})
Vue.filter("readableDuration",(millisec)=>{
  var seconds = (millisec / 1000).toFixed(0);
        var minutes = Math.floor(seconds / 60);
        var hours = "";
        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            hours = (hours >= 10) ? hours : "0" + hours;
            minutes = minutes - (hours * 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
        }

        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        if (hours != "") {
          return `${hours} hours ${minutes} minutes`
            // return hours + ":" + minutes + ":" + seconds;
        }else if(minutes == 0){
          return `${seconds} seconds`
        }
         return `${minutes} minutes ${seconds} seconds`;
});
Vue.filter("humenDate", function(millisec) {
  if (millisec) return new Date(parseInt(millisec)).toUTCString();
  return millisec;
  var seconds = Math.round((millisec / 1000).toFixed(1));

  var minutes = Math.round((millisec / (1000 * 60)).toFixed(1));

  var hours = Math.round((millisec / (1000 * 60 * 60)).toFixed(1));

  var days = Math.round((millisec / (1000 * 60 * 60 * 24)).toFixed(1));

  if (seconds < 60) {
    return seconds + " Sec";
  } else if (minutes < 60) {
    return minutes + " Min";
  } else if (hours < 24) {
    return hours + " Hrs";
  } else {
    return days + " Days";
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
