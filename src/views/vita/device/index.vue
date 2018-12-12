<template>
    <el-row>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  class="el-icon-search" v-on:click="getFormData">查询</el-button>
                </el-form-item>
				
								<el-form-item style="float: right;font-size: 18px;">
									<i class="el-icon-circle-plus-outline" @click="fillDevice()"></i>
								</el-form-item>
						
            </el-form>

        </el-col>
		
		<div>
			<el-table :data="list" v-loading="listLoading" ref="deviceListTable" border fit highlight-current-row style="width: 99%">
				<el-table-column align="center" label="设备名称">
					<template slot-scope="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="设备编号" prop="deviceNo" />
				<!-- <el-table-column align="center" label="前缀管理" prop="masterIndex" /> -->
				<el-table-column align="center" label="设备用途">
					<template slot-scope="scope">
						<span>{{ scope.row.description}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<i class="el-icon-edit-outline" @click="eiditDevice(scope.row)"></i>
						<i class="el-icon-delete" @click="deleteDevice(scope.row.id, scope.$index)"></i>
					</template>
				</el-table-column>
			</el-table>
			
			<div v-show="pageShow" class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
		</div>
       
	
	
						<!--修改信息-->
		        <el-col :span="2">
		            <el-dialog title="设备信息" :visible.sync="dialogFormVisible">
		                <div style="width:80%;margin: 0 auto">
		                    <el-form v-loading="updateLoading" :model="deviceForm" status-icon :rules="rules" ref="deviceForm" :inline="false" label-width="90px">
		                      
		                        <el-form-item label="设备名称"   prop="name">
		                        		<el-input type="text" placeholder="请输入设备名称" auto-complete="off" v-model="deviceForm.name"></el-input>
		                        </el-form-item>
														
														<el-form-item label="设备编号"   prop="deviceNo">
																<el-input type="text" placeholder="请输入设备编号" auto-complete="off" v-model="deviceForm.deviceNo"></el-input>
														</el-form-item>
														
														<el-form-item label="设备描述"   prop="description">
																<el-input type="text" placeholder="请输入设备描述" auto-complete="off" v-model="deviceForm.description"></el-input>
														</el-form-item>
														
														<el-form-item label="主板" prop="masterId">
																<el-select v-model="deviceForm.masterId" filterable placeholder="请选择">
																		<el-option
																						v-for="item in masterList"
																						:key="item.id"
																						:label="item.termNo"
																						:value="item.id">
																		</el-option>
																</el-select>
														</el-form-item>
														
														<el-form-item label="主板INDEX"   prop="masterIndex">
																<el-input type="text" placeholder="请输入主板INDEX" auto-complete="off" v-model="deviceForm.masterIndex"></el-input>
														</el-form-item>
		                       
		
														
		                    </el-form>
		                </div>
		                <div slot="footer" class="dialog-footer">
		                    <el-button @click="dialogFormVisible = false">取 消</el-button>
		                    <el-button type="primary" @click="submitForm('deviceForm')">确 定</el-button>
		                </div>
		            </el-dialog>
		        </el-col>
		
       
	   
	   
    </el-row>
</template>

<script>
	import { fetchList, deleteDevice, queryMainboard, addDevice, updateDevice} from "@/api/vita/device.js";
	import { mapState, mapGetters } from "vuex";

	
	export default {
		components: {
		
		},
		data() {
			return {
				filters: {
					keyword: ''
				},
				tableKey: 0,
				list: null,
				total: null,
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 20
				},
				pageShow: false,
				deviceForm: {
						
				},
				updateLoading:false,
				dialogFormVisible: false,
				masterList:[],
			  rules: {
						name: [
								{ required: true, message: '请输入设备名称', trigger: 'blur' },
						],
						deviceNo: [
								{ required: true, message: '请输入设备编号', trigger: 'blur' },
						],
						description: [
								{ required: true, message: '请输入设备描述', trigger: 'blur' },
						],
						masterId: [
								{ required: true, message: '请选择主板', trigger: 'blur' },
						],
						masterIndex: [
								{ required: true, message: '请输入主板INDEX', trigger: 'blur' },
						],
				},
				isUpdate:false,
			};
		},
		computed: {
			...mapGetters(["permissions"]),
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		filters: {
			publishStateFilter(state) {
				if(state) {
					const publishStateMap = {
						'1': "公开",
						'2': '部分公开',
						'3': '不公开'
					};
					return publishStateMap[state];
				}
			},
			stateFilter(state) {
				const publishStateMap = {
					'1': "待审核 ",
					'2': '审核通过',
					'3': '审核失败'
				};
				return publishStateMap[state];
			},
			typeFilter(type){
				const typeMap = {
					'1': "普通文章"
				};
				return typeMap[type];
			}
		},
		created() {
			this.getList();
			this.queryMainboard();
		},
		methods: {
			// 查询菜单
			async getFormData () {
				
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.list = null;
			},
			getList() {
				this.listLoading = true;
				this.pageShow = false;
				fetchList(this.listQuery).then(res => {
					this.list = res.data.data.list
					this.total = res.data.data.total
					this.listLoading = false;
					if(this.total > 0)
						this.pageShow = true;
				});
			},
			queryMainboard(){
				
				queryMainboard().then(res => {
					console.log('主板信息');
					console.log(res);
					this.masterList = res.data.data.list
				});
			},
			handleSizeChange(val) {
				this.listQuery.pageSize = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.startPage = val;
				this.getList();
			},
			/**
			* ifshow: true/false msg: message  type: error/warning/success
			*/
			message(ifshow,msg,type) {
				this.$message({
					showClose: ifshow,
					message: msg,
					type: type
				})
			},
			fillDevice(){
				this.dialogFormVisible = true;
				this.deviceForm = {};
				this.isUpdate = false;
				this.$refs['deviceForm'].clearValidate(); //移除校验结果
				
			},
			eiditDevice(deviceInfo){
				this.dialogFormVisible = true;
				this.deviceForm = deviceInfo;
				this.isUpdate = true;
				this.$refs['deviceForm'].clearValidate(); //移除校验结果
				
				
			},
			deleteDevice(deviceId,index){
				
					console.log(index)
					this.listLoading = true;
					
					let params = {
							id: deviceId
					}
					
					deleteDevice(params).then(res => {
						this.listLoading = true;
						console.log(res);
						if(res.data.desc == 'SUCCESS'){
							this.listLoading = false;
							this.$message({
								type: 'success',
								message: '删除成功'
							});
							this.list.splice(index,1);
						}
					});
			},
			// 表单提交
			submitForm(formName) {
					this.$refs[formName].validate((valid) => {
							if (valid) {
									console.log(formName);
									if(this.isUpdate){
										this.updateDevice();
									}else
										this.addDevice();
									
							} else {
								
									return false
							}
					})
			},
			addDevice(){
				this.updateLoading = true;
				addDevice(this.deviceForm).then(res => {
					this.updateLoading = false;
					if(res.data.desc == 'SUCCESS'){
						this.$message({
							type: 'success',
							message: '添加成功'
						});
						this.dialogFormVisible = false;
						this.getList();
					}
				});
				
			},
			updateDevice(){
					this.updateLoading = true;
					updateDevice(this.deviceForm).then(res => {
						this.updateLoading = false;
						if(res.data.desc == 'SUCCESS'){
							this.$message({
								type: 'success',
								message: '更新成功'
							});
							this.dialogFormVisible = false;
							this.getList();
						}
					});
			},
			
		}
	};
</script>

<style scoped="scoped">
	
	.el-icon-circle-plus-outline{
		font-size: 20px;
	}
	
</style>