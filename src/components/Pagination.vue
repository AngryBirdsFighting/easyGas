/**
 * @Author:      dousp
 * @DateTime:    2018-06-13 16:14:10
 * @Description: 分页封装
 */
<template>
    <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currPage" :page-sizes="[10,20,30,50]" 
        :page-size="callBackData.iDisplayLength" layout="total, sizes, prev, pager, next, jumper" :total="total">
	    </el-pagination>
    </div>
</template>

<script>
    import { utils } from 'src/utils';
    export default {
        name: 'Pagination',
        props: ['total'],
        data() {
            return {
                currPage: (this.total == 0) ? 0 :1,
                callBackData: {
                    iDisplayStart: 0,
                    iDisplayLength: 10
                }
            };
        },
        methods: {
            /**
             * 列表删除，调用该接口去刷新列表--主要判断是是否跳到上一页
             */
            deleteItemReLoadList() {
                if (utils.deleteIsBackBeforePage(this.currPage, this.total, this.callBackData.iDisplayLength)) {
                    this.currPage -= 1;
				} else {
                    this.$emit('reLoadData', this.callBackData);
				}
            },
            /**
             * 返回首页
             */
            backFirstPage() {
                this.currPage = 1;
            },
            /**
             * 分页大小改变--如果是首页直接刷新，如果不是首页去计算那一页会将当前页面的内容显示出来就去加载该页
             */
			handleSizeChange(val) {
				this.callBackData.iDisplayLength = val;
				if (this.currPage == 1) {
                    this.$emit('reLoadData', this.callBackData);
				}
				else{
					this.currPage = Math.floor(this.callBackData.iDisplayStart / this.callBackData.iDisplayLength) + 1;
                }
                
			},
			/**
             * 当前分页改变--直接刷新新页
             */
			handleCurrentChange(val) {
				this.currPage = val;
                //计算当前页从那条开始
                this.callBackData.iDisplayStart = (this.currPage - 1) * this.callBackData.iDisplayLength;
                this.$emit('reLoadData', this.callBackData);
			},
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    //页码显示为红的
    .pagination-container input {
        box-shadow: none;
    }
</style>
