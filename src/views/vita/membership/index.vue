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
								<el-button type="success" @click="addMember()">新增</el-button>
							</el-form-item> -->
							
            </el-form>
			
			
			
        </el-col>
		
		<div>
			<el-table :data="list" v-loading="listLoading" ref="memberListTable" border fit highlight-current-row style="width: 99%">
				<el-table-column align="center" label="头像">
					<template slot-scope="scope">
						<img class="userIcon" :src="scope.row.photo" />
					</template>
				</el-table-column>
				<el-table-column align="center" label="昵称" prop="nickName" />
				<el-table-column align="center" label="手机号码">
					<template slot-scope="scope">
						<span>{{ scope.row.phone}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="会员等级">
					<template slot-scope="scope">
						<el-tag
							:type="scope.row.type | typeFilter">
							{{scope.row.type | typeNameFilter}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" label="查看">
					<template slot-scope="scope">
						<i class="icon-ai-eye" @click="dialogDetail(scope.row)"></i>
					</template>
				</el-table-column>
			</el-table>
			
			<div v-show="pageShow" class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
		</div>
       
			 
			 
			 
										<!--查看信息-->
			 							<el-col :span="2">
			 									<el-dialog title="设备信息" :visible.sync="dialogFormVisible">
			 											<div style="width:90%;margin: 0 auto">
															
																<div class="sectionInfo">个人信息</div>
																<div class="listInfo">
																		<div class="inlineH">头像</div>
																		<div class="inlineH">姓名</div>
																		<div class="inlineH">手机</div>
																		<div class="inlineH">身份证</div>
																</div>
																<div class="listInfo">
																		<div class="inlineD">
																			<img class="userIcon" :src="lookData.photo" />
																		</div>
																		<div class="inlineD">{{ lookData.name}}</div>
																		<div class="inlineD">{{ lookData.phone}}</div>
																		<div class="inlineD">{{ lookData.certNo}}</div>
																</div>
			 															
																<!-- <div class="sectionInfo">公司信息</div>
																<div>
																		<img class="userIcon" :src="lookData.photo" />
																		<span>{{ lookData.phone}}</span>
																</div> -->
																
																<div class="sectionInfo">消费记录</div>
																<el-table :data="orderList" ref="orderListTable" border fit highlight-current-row style="width: 99%">
															
																	<el-table-column align="center" label="订单号" prop="orderNo" />
																	<el-table-column align="center" label="交易时间" prop="orderDate" />
																	<el-table-column align="center" label="交易详情">
																		<template slot-scope="scope">
																			<span>{{ scope.row.productName}}</span>
																		</template>
																	</el-table-column>
																	<el-table-column align="center" label="交易金额">
																		<template slot-scope="scope">
																			<span>{{ scope.row.orderAmt/100}}</span>
																		</template>
																	</el-table-column>
																	<el-table-column align="center" label="支付方式">
																		<template slot-scope="scope">
																			<span>{{ scope.row.payChannel | payTypeFilter}}</span>
																		</template>
																	</el-table-column>
																	
																</el-table>
														
															
																
																
			 											</div>
			 									</el-dialog>
			 							</el-col>
	
       
	   
	   
    </el-row>
</template>

<script>
	import { fetchList, queryOrderList} from "@/api/vita/membership.js";
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
				dialogFormVisible: false,
				lookData:{photo:'',phone:''},
				orderList:[],

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
					'01': "",
					'02': "success",
					'03': "warning",
				};
				return typeMap[type];
			},
			typeNameFilter(type){
				const typeMap = {
					'01': "个人会员",
					'02': "企业会员",
					'03': "培训机构",
				};
				return typeMap[type];
			},
			payTypeFilter(type){
				const typeMap = {
					'01': "支付宝",
					'02': "微信",
					'03': "账户",
				};
				return typeMap[type];
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
				this.detailList = null;
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
			addMember(){


				
				
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
			dialogDetail(dataInfo){
				this.lookData = dataInfo;
				this.dialogFormVisible = true;
				console.log(this.lookData);
				
				let param = {
					userId:dataInfo.id
				}
				
				queryOrderList(param).then(res => {
					console.log(res);
					this.orderList = res.data.data.list;
				});

			}
			
		}
	};
</script>

<style scoped="scoped">
	
	.userIcon{
		max-height: 50px;
		width: auto;
		max-width: 50px;
		border-radius: 25px;
	}
	
	.sectionInfo{
		height: 30px;
		background-color: lightgray;
		padding-left: 20px;
	}
	
	.inlineH{
		display: inline-block;
		width: 20%;
		text-align: center;
	}
	
	.inlineD{
		display: inline-block;
		width: 20%;
    text-align: center;
		height: 60px;
		line-height: 60px;
	}
	
	.inlineD img{
		vertical-align:middle
	}
	
	
</style>