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
				
				<el-form-item style="float: right;">
					<el-button type="success" @click="addAticle()">新增</el-button>
				</el-form-item>
            </el-form>
			
			
			
        </el-col>
		
		<div>
			<el-table :data="list" v-loading="listLoading" ref="auditListTable" border fit highlight-current-row style="width: 99%">
				<el-table-column align="center" label="文章类型">
					<template slot-scope="scope">
						<span>{{ scope.row.type | typeFilter }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="发布人员" prop="publisherName" />
				<el-table-column align="center" label="发布属性">
					<template slot-scope="scope">
						<span>{{ scope.row.publishState | publishStateFilter }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="发布时间" prop="publisherTime" />
				<el-table-column align="center" label="审核状态">
					<template slot-scope="scope">
						<span>{{ scope.row.state | stateFilter }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核人员">
					<template slot-scope="scope">
						<span>{{ scope.row.verifierName}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="查看">
					<template slot-scope="scope">
						<i class="icon-ai-eye" @click="dialogDetail(scope.row.id)"></i>
					</template>
				</el-table-column>
			</el-table>
			
			<div v-show="pageShow" class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			
		</div>
       
	
       
	   
	   
    </el-row>
</template>

<script>
	import { fetchList} from "@/api/vita/ground.js";
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
					pubState: '',
					state: '',
					startPage: 1,
					pageSize: 20
				},
				activeId: '0',
				pageShow: false,
				viewNewfs: false,
				viewUpdateNewfs: false,
				newlists:{},
				aticleText:'',
				isCreate: 0,
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
// 				this.listLoading = true;
// 				this.pageShow = false;
// 				fatchList(this.listQuery).then(res => {
// 					this.list = res.data.data.list
// 					this.total = res.data.data.total
// 					this.listLoading = false;
// 					if(this.total > 0)
// 						this.pageShow = true;
// 				});
			},
			handleSizeChange(val) {
				this.listQuery.pageSize = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.startPage = val;
				this.getList();
			},
			addAticle(){
				//this.viewNewfs = true;
				
				this.activeId = new Date().getTime()+'';
				this.isCreate = 1;
				this.viewUpdateNewfs = true
				
				this.newlists = {};
				this.aticleText = '';
				
			},
			cancelNewFsDialog() {
				this.viewNewfs = false;
			},
			cancelUpdateNewFsDialog() {
				this.viewUpdateNewfs = false;
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
			dialogDetail(idMsg){
				this.activeId = idMsg
				this.isCreate = 0
				this.viewUpdateNewfs = true;
				
				

			}
			
		}
	};
</script>