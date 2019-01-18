/**
 * @Author:      qinbb
 * @DateTime:    2018-03-22 09:37:27
 * @Description: 导入组件
 */
<template>
    <!-- 导入 -->
    <el-dialog :title="title" :visible.sync="importVisible.imports" @open="dialogShow" :show-close = "importClose" top="10%" lock-scroll width='700px'
      :close-on-click-modal="false" :close-on-press-escape="false">
        <div v-show="!exportFinish" class="import-box">
            <ul>
                <li class="fl">
                    <p class="import-tip"><i class="el-icon-info"></i>导入说明</p>
                    <p>1.在导入数据前，先下载数据模版
                      <el-button @click.native.prevent="downTemple" class="downBtn">点击下载数据模版</el-button>
                    </p>
                    <p>2.填写数据并选择上传文件；</p>
                    <p>3.每次导入不超过65535条数据；</p>
                    <p>4.请注意数据导入格式必须填项。</p>
                </li>
                <li class="fr">
						<el-upload class="avatar-uploader"
							action="/proxy/import/importData"
							:show-file-list="false"
							:on-success="handleAvatarSuccess"
							:auto-upload="false"
							ref="upload"
							:before-upload="beforeAvatarUpload"
							:data="{templetName : importVisible.templateName}"
							:on-change="fileChange"
							:limit = 2
                            :file-list="fileList"
							:on-error="logoUploadError">
                            <img v-if="fileList.length > 0" class="upload_fileBG"/>
							<img v-else class="upload_fileoldBG"/>
                            <span class="showImportName" :title="inputText">{{inputText}}</span>
						</el-upload>
                </li>
            </ul>
        </div>
        <div v-show="exportFinish">
            <div v-if="exportResult.validSuccess">
				<!-- 全部导入成功 -->
				<div v-if="exportResult.fail == 0">
					<strong>{{exportResult.success}}条数据全部导入成功！</strong>
				</div>
				<!-- 导入失败 -->
				<div v-else>
					<strong style="display: block; margin-bottom: 10px;">{{exportResult.success}}条数据导入成功,{{exportResult.fail}}条数据导入失败！失败原因如下：</strong>
					<el-table :data="exportResult.failReason" :height="height" border fit highlight-current-row>
						<el-table-column align="center" label='行' prop="rowNum" width="130"></el-table-column>
						<el-table-column align="center" label='列' prop="columNum" width="130"></el-table-column>
						<el-table-column align="center" label='失败原因' prop="message"></el-table-column>
            		</el-table>
				</div>
			</div>
			<!-- 校验失败 -->
			<div v-else><strong>{{exportResult.validMsg}}</strong></div>
        </div>
        <el-button type="primary"  icon="el-icon-close" class="btnColor closeBtn" @click.native.prevent="canelImport"></el-button>  
        <div slot="footer" class="dialog-footer">
			<el-button v-show="exportFinish" @click.native.prevent="canelImport">确 定</el-button>
            <el-button v-show="!exportFinish" @click.native.prevent="canelImport">取 消</el-button>
            <!-- <el-button v-show="!exportFinish" type="primary" :disabled="fileDisabled" @click.native.prevent="importSubmit" class="btnColor">确 定</el-button> -->
            <el-button v-show="!exportFinish" type="primary" :loading="startImport" :disabled="fileDisabled" @click.native.prevent="importSubmit" class="btnColor">{{btnText}}</el-button>
        </div>       
    </el-dialog>
</template>

<script>
    import { Message } from 'element-ui';
    export default {
        name: 'Import',
        // 声明 props
        props: ['importVisible'],
        data() {
            return {
                importClose: false,//不显示自带的关闭按钮
                inputText: '文件类型(xls,xlsx)',//input的text
                fileDisabled: true,//确认按钮
                fileList: [],
                btnText: "确 定",
                startImport: false,

				height: 340,
                exportFinish: false,
                title: "导入数据",
                exportResult: {
                    fail: 0,
                    failReason: [],
                    success: 0,
                    validMsg: "",
                    validSuccess: true,
              },
            };
        },
        mounted() {
			
        },
        methods:{
			dialogShow() {
                this.inputText = '文件类型(xls,xlsx)';
				this.exportFinish = false;
				this.title= "导入数据";
				this.exportResult.fail = 0;
				this.exportResult.failReason = [];
				this.exportResult.success = 0;
				this.exportResult.validMsg = "";
				this.exportResult.validSuccess = true;

				if (this.$refs.upload) {
					this.$refs.upload.clearFiles();
				}
                
                this.btnText = "确 定";
                this.startImport = false;
                this.fileList = [];
				this.fileDisabled = true;
			},
			//上传成功
			handleAvatarSuccess(res, file) {
				this.title= "导入结果";
            	this.exportFinish = true;
            	this.exportResult = res;
			},
			//上传失败
			logoUploadError(err, file, fileList) {
				//编辑时上传失败
                Message.error({message: "数据文件上传失败!"});
                this.btnText = "确 定";
                this.startImport = false;
			},
			beforeAvatarUpload(file) {
				return this.isExcel(file);
			},
			importSubmit() {
                this.btnText = "正在导入。。。";
                this.startImport = true;
				this.$refs.upload.submit();
			},
			fileChange(file, fileList) {
                //保证第二次选择，将第一次的替换掉
				if (file.status == "ready")
				{
					if (fileList.length > 0) {
                        this.inputText = file.name;
                        this.fileList = [];
                        this.fileList.push(file);
                        this.fileDisabled = false;
                    } else {
                        this.fileDisabled = true;
                    }
				} else if (file.status == "success") {
				}
			},
            //修改父组件的值
            canelImport(){
                this.$emit('changeImport',false);
            },
            //下载模板
            downTemple(){				
				let $iframe = $('<iframe id="down-file-iframe" />');
				let $form = $('<form method="post" />');
				$form.attr('action', "/proxy/import/downTemple");

				$form.append('<input type="hidden" name="templetName" value="' + this.importVisible.templateName + '" />');

				$iframe.append($form);
				$(document.body).append($iframe);
				$form[0].submit();
				$iframe.remove();
            },
            //上传前对文件的大小的判断
            isExcel(files){
                const extension = files.name.split('.')[1] === 'xls';
                const extension2 = files.name.split('.')[1] === 'xlsx';
                const isLt2M = files.size / 1024 / 1024 < 10;
                if (!extension && !extension2) {
                    Message.error('上传模板只能是 xls、xlsx格式!');
                }
                if (!isLt2M) {
                    Message.error('上传模板大小不能超过 10MB!');
                }
                return (extension || extension2)  && isLt2M;
            }

        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .closeBtn{
      position: absolute;
      top: 5px;
      right: 0;
      font-size: 16px;
      outline: none;
      border: none;
      &:hover{
        color:red;
        background: #67d3e0;
      }
	}
	.avatar-uploader .el-upload {
		border: none;
		border-radius: 6px;
        width: 155px;
		height: 175px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
        right: 50px;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 155px;
		height: 125px;
		line-height: 125px;
		text-align: center;
	}
    .downBtn{
      outline: none;
      border: none;
      color: #67d3e0;
      &:hover{
        background: #fff;
      }
    }
    .upload_fileoldBG,.upload_fileBG{
      margin:0px;
      height:100%;
      width: 100%;
      border: none;
    }
    .upload_fileoldBG{
    	background: url(../assets/img/fileBG.png) no-repeat center center;
    }
    .upload_fileBG{
        background: url(../assets/img/upload-file.png) no-repeat center center;
    }
    .uploadInput{
      width: 120px;
      height: 140px;
      opacity: 0;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .showImportName{
      cursor: pointer;
      word-wrap: break-word;
      word-break: break-all;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      position: relative;
      bottom: 20px;
    }
</style>