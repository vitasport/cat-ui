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
				
								<!-- <el-form-item style="float: right;">
									<i class="el-icon-circle-plus-outline" @click="fillGround()"></i>
								</el-form-item> -->
            </el-form>
			
			
			
        </el-col>
		
		<div>
			<el-table :data="list" v-loading="listLoading" ref="groundListTable" border fit highlight-current-row style="width: 99%">
				<el-table-column align="center" label="场地名称">
					<template slot-scope="scope">
						<span>{{ scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="运动类型">
					<template slot-scope="scope">
						<span>{{ scope.row.sportKey | typeFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="描述" prop="discription" />
				<el-table-column align="center" label="价格">
					<template slot-scope="scope">
						<span>{{ scope.row.price/100 }}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
					<i class="el-icon-edit-outline" @click="eiditGround(scope.row)"></i>
					<i class="el-icon-delete" @click="deleteGround(scope.row.id, scope.$index)"></i>
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
													<el-form v-loading="updateLoading" :model="groundForm" status-icon ref="groundForm" :inline="false" label-width="90px">
														
															<el-form-item label="场地名称"   prop="name">
																	<el-input type="text" placeholder="场地名称" auto-complete="off" v-model="groundForm.name"></el-input>
															</el-form-item>
															
															<!-- <el-form-item label="运动类型"   prop="sportKey">
																	<el-select v-model="groundForm.sportKey" filterable placeholder="请选择">
																			<el-option
																							v-for="item in typeList"
																							:key="item.id"
																							:label="item.name"
																							:value="item.id">
																			</el-option>
																	</el-select>
															</el-form-item> -->
															
															<el-form-item label="描述"   prop="discription">
																	<el-input type="text" placeholder="请输入描述" auto-complete="off" v-model="groundForm.discription"></el-input>
															</el-form-item>
															
															<el-form-item label="价格"   prop="price">
																	<el-input type="text" placeholder="请输入价格" auto-complete="off" v-model="groundForm.realPrice"></el-input>
															</el-form-item>

															
													</el-form>
											</div>
											<div slot="footer" class="dialog-footer">
													<el-button @click="dialogFormVisible = false">取 消</el-button>
													<el-button type="primary" @click="submitForm('groundForm')">确 定</el-button>
											</div>
									</el-dialog>
							</el-col>
			
       
	   
	   
    </el-row>
</template>

<script>
	import { fetchList, addGround, deleteGround, updateGround} from "@/api/vita/ground.js";
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
				groundForm: {
						
				},
				updateLoading:false,
				dialogFormVisible: false,
			  rules: {
						name: [
								{ required: true, message: '请输入设备名称', trigger: 'blur' },
						],
						GroundNo: [
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
				typeList:[{id:'01',name:'篮球'},{id:'02',name:'网球'}],
			};
		},
		computed: {
			...mapGetters(["permissions"]),
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		filters: {
				typeFilter(type){
					const typeMap = {
						'01': "篮球",
						'02': "网球",
					};
					return typeMap[type];
				},
				moneyFilter(money){
					return money/100;
				}
		},
		created() {
			this.getList();
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
			fillGround(){
				this.dialogFormVisible = true;
				this.groundForm = {};
				this.isUpdate = false;
				//this.$refs['groundForm'].clearValidate(); //移除校验结果
				
			},
			eiditGround(groundInfo){
				this.dialogFormVisible = true;
				this.groundForm = groundInfo;
				this.groundForm.realPrice = groundInfo.price/100;
				this.isUpdate = true;
				//this.$refs['groundForm'].clearValidate(); //移除校验结果
				
				
			},
			deleteGround(GroundId,index){
				
					console.log(index)
					this.listLoading = true;
					
					let params = {
							id: GroundId
					}
					
					deleteGround(params).then(res => {
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
										this.updateGround();
									}else
										this.addGround();
									
							} else {
								
									return false
							}
					})
			},
			addGround(){
				this.updateLoading = true;
				addGround(this.groundForm).then(res => {
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
			updateGround(){
					this.updateLoading = true;
					
					var params = {
						id:this.groundForm.id,
						name:this.groundForm.name,
						discription:this.groundForm.discription,
						price:this.groundForm.realPrice*100,
					}
					
					updateGround(params).then(res => {
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