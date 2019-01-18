/*** 
 * @Author: wangchao
 * @DateTime: 2018-03-13 16:14:10 
 * @Description: 显示时间范围组件（年月日）
 */
<template>
    <div class="limit-packer">
		<el-date-picker v-model="datePicker.fromTime" type="date" :picker-options="pickerBeginDateBefore" format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
		<span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
	    <el-date-picker v-model="datePicker.toTime" type="date" format="yyyy-MM-dd" :picker-options="pickerBeginDateAfter" placeholder="结束日期"></el-date-picker>
	</div>
</template>

<script>
import { utils } from "src/utils";
export default {
    name: "DateLimitPicker",
    data() {
        const vm = this;
        return {
            pickerBeginDateBefore: {
                disabledDate: time => {
                    return time.getTime() > new Date().getTime();
                }
            },
            pickerBeginDateAfter: {
                disabledDate: time => {
                    let b = new Date();
                    let beginDateVal = this.datePicker.fromTime;
                    let endTime = beginDateVal.getTime() + 2592000000;
                    if (beginDateVal) {
                        if (
                            (b.getTime() - beginDateVal.getTime()) /
                                1000 /
                                60 /
                                60 /
                                24 >
                            30
                        ) {
                            return (
                                time.getTime() < beginDateVal ||
                                time.getTime() > endTime
                            );
                        } else {
                            return time.getTime() > new Date().getTime();
                        }
                    }
                }
            },
            datePicker: {
                fromTime: "",
                toTime: ""
            }
        };
    },
    watch: {
        "datePicker.fromTime": function(newVal, oldVal) {
            if (newVal !== oldVal && oldVal != "") {
                this.datePicker.toTime = "";
            }
        }
    }
};
</script>
<style  rel="stylesheet/scss" lang="scss">
.limit-packer>div {
		width: 140px !important;
	}
</style>
