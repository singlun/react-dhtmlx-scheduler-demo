/*global gantt*/
import React, { Component } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
//import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_glossy.css';

 import 'dhtmlx-scheduler/codebase/locale/locale_cn'
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_readonly'
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_active_links'
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_editors'
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_limit'
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_serialize'

import './scheduler.css'

export default class Scheduler extends Component {


      data () {
        return {}
    }


    shouldComponentUpdate(nextProps ){
        return this.props.zoom !== nextProps.zoom;
    }

    componentDidUpdate() {

        window.scheduler.render();
    }

    componentDidMount() {


        window.scheduler.config.xml_date="%Y-%m-%d %H:%i";
        window.scheduler.config.api_date="%Y-%m-%d %H:%i";
        window.scheduler.config.first_hour = 7;
        // window.scheduler.config.limit_time_select = true;
        window.scheduler.config.last_hour=21;
         window.scheduler.config.active_link_view = "week"; // where we can jump from the month view
        window.scheduler.config.details_on_dblclick = true;
         var step=30;
        window.scheduler.config.time_step = step;
       // window. scheduler.locale.labels.section_description = "";
        //window. scheduler.locale.labels.section_status = "Completed";
        var format = window.scheduler.date.date_to_str("%H:%i");
        window. scheduler.config.hour_size_px=(60/step)*22;
        window. scheduler.templates.hour_scale = function(date){
           var  html="";
            for (var i=0; i<60/step; i++){
                html+="<div style='height:22px;line-height:22px;'>"+format(date)+"</div>";
                date = window.scheduler.date.add(date,step,"minute");
            }
            return html;
        }
        window. scheduler.config.cascade_event_display = true; // enable rendering, default value = false
        //window. scheduler.config.cascade_event_count = 4; // how many events events will be displayed in cascade style (max), default value = 4
        //window. scheduler.config.cascade_event_margin = 30; // margin between events, default value = 30
        window.scheduler.config.dblclick_create = false;


        window. scheduler.config.details_on_create=true;


        window.scheduler.config.limit_start =window.scheduler.date.add((new Date()),3,"day");
        window. scheduler.config.limit_end =window.scheduler.date.add((new Date()),30,"day")  ;


        window. scheduler.init('scheduler_here', new Date(), 'week')
        window. scheduler.parse([

            {text: 'Conference', start_date: '2017-12-20 12:00', end_date: '2017-12-20 19:00',completed:true},
            {text: 'Conference', start_date: '2017-12-21 12:00', end_date: '2017-12-21 19:00',completed:false}

        ], 'json')
        function block_readonly(id){


           console.dir(this)
           console.log('id:'+id);
            if (!id) return true;
            return !this.getEvent(id).readonly;
        }

        function addEventNow(id){


            //console.dir(this.getEvent(id))
            //console.log('id:'+id);
              return;
        }
        window.scheduler.attachEvent("onLimitViolation", function  (id, obj){
            console.log("当前时间不能预约")
        });

        window.scheduler.attachEvent("onBeforeDrag",block_readonly)
        window.scheduler.attachEvent("onClick",block_readonly)
        window.scheduler.attachEvent('addEventNow',addEventNow)

        window. scheduler.addEvent({
            id:1,
            start_date: '2017-12-20 9:00',
            end_date: '2017-12-20 17:00',
            text:"readonly (dbl-click)",
            readonly:true
        });

        // Setting up holidays
        var holidays = [ new Date('2017-12-20 12:00'), new Date('2017-12-21'), new Date('2017-12-22') ];
        for (var i=0; i<holidays.length; i++) {
            var date = holidays[i];
            var options = {
                start_date: date,
                end_date:  window.scheduler.date.add(date, 1, "hour"),
                type: "dhx_time_block", /* creating events on those dates will be disabled - dates are blocked */
                css: "holiday",
                html: "holiday",

            };
            window.scheduler.addMarkedTimespan(options);
        }


        window. scheduler.templates.week_date_class=function(date,today){

            if ( today>date)
                return "weekday";
            return "";
        };



        window.scheduler.templates.month_date_class=function(date,today){
            if (date<today)
                return "good_day";
            return "";
        }

        window. scheduler.templates.event_text=function(start,end,event){
             if(event.text==='新建日程')
             {
                 event.text='预约说明'
                 event.Description=event.text

             }

            return   event.text ;
        };



        window.scheduler.attachEvent("onEventSave",function(id,ev){


            if(ev.start_date<(new Date()))
            {

                //dhtmlx.alert("当前时间不能预约");
                console.log("当前时间不能预约")
                return false;
            }
            // if (!ev.text) {
            //     //dhtmlx.alert("描述不能为空");
            //     return false;
            // }
            // if (ev.text.length<20) {
            //     //dhtmlx.alert("描述");
            //     return false;
            // }
            return true;
        });

        function onBeforeDrag( id,  drag_mode, e){


            console.log('test')
            console.dir(window.scheduler.drag)

            return true;
        }

        window.scheduler.attachEvent("onBeforeDrag",onBeforeDrag)
        //window.scheduler.attachEvent("onClick",function(){return false;})




        window. scheduler.updateView();

    }

  render() {


    return (
        <div id="scheduler_here" className="dhx_cal_container" style=
            {{width: '100%', height: '100%'}}>
            {/*< button className="ceshi" style={{margin_left: '250px', type:"primary"}}  >中文</button>*/}
            {/*< button className="ceshi" style={{margin_left: '350px' ,type:"primary" }} >英文</button>*/}
      <div className="dhx_cal_navline">
          <div className="dhx_cal_prev_button">&nbsp;</div>
          <div className="dhx_cal_next_button">&nbsp;</div>
          <div className="dhx_cal_today_button"></div>
          <div className="dhx_cal_date"></div>
          <div className="dhx_cal_tab" name="day_tab" style={{right:'204px'}}></div>
          <div className="dhx_cal_tab" name="week_tab" style={{right:'140px'}}></div>
          <div className="dhx_cal_tab" name="month_tab" style={{right:'76px'}}></div>
      </div>

      <div className="dhx_cal_header">
      </div>
      <div className="dhx_cal_data">
      </div>
  </div>
    );
  }
}