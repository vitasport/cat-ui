<template>
	<div class="app-container calendar-list-container">
		<div class="filter-container">
			<el-form :model="listQuery" ref="listQuery" label-width="120px">
				<el-row :gutter="20" justify="space-around">
					<el-col :span="8">
						<el-form-item label="发布日期:" prop="dates">
							<el-date-picker v-model="listQuery.dates" type="daterange" format="yyyy-MM-dd" value-format="yyyyMMdd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="发布属性:" prop="pubState">
							<el-select v-model="listQuery.pubState" default-first-option placeholder="导入类型">
								<el-option label="全部" value=""></el-option>
								<el-option label="公开" value="1"></el-option>
								<el-option label="部分公开" value="2"></el-option>
								<el-option label="不公开" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核状态:" prop="state">
							<el-select v-model="listQuery.state" default-first-option placeholder="导入类型">
								<el-option label="全部" value=""></el-option>
								<el-option label="待审核" value="W"></el-option>
								<el-option label="审核通过" value="M"></el-option>
								<el-option label="审核失败" value="M"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" class="row-bg" justify="end">
					<el-button type="primary" @click="handleFilter('listQuery')">搜索</el-button>
					<el-button @click="resetForm('listQuery')">重置</el-button>
				</el-row>
			</el-form>
		</div>
		<el-table :data="list" v-loading="listLoading" type="selection" @select-all="selectionAll" @select="handleSelectionChange" border fit highlight-current-row style="width: 99%">
			<el-table-column align="center" label="订单号">
				<template slot-scope="scope">
					<span>{{ scope.row.type | typeFilter }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="订场人">
				<template slot-scope="scope">
					<span>{{ scope.row.title}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态" prop="publisherName" />
			<el-table-column align="center" label="时间">
			</el-table-column>
			<el-table-column align="center" label="金额">
				<template slot-scope="scope">
					<span>{{ scope.row.publisherTime | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="支付方式">
				<template slot-scope="scope">
					<span>{{ scope.row.state | stateFilter }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<i class="icon-ai-eye" @click="dialogDetail(scope.row.id)"></i>
				</template>
			</el-table-column>
		</el-table>
		<div v-show="buttonShow" class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
		<div>
			<el-row type="flex" class="row-bg" justify="end">
				<el-col :span="6">
				</el-col>
				<el-col :span="6">
				</el-col>
				<el-col style="text-align: right;">
					<el-button v-show="buttonShow" v-if="sys_audit_confirm" type="primary" @click="auditC()">确认审核</el-button>
					<el-button v-show="buttonShow" v-if="sys_audit_refuse" type="warning" @click="auditR()">审核拒绝</el-button>
				</el-col>
			</el-row>
		</div>

		<el-dialog :visible.sync="dialogVisible" @close="cancel" center>
			<div style="text-align: center;" v-html="content"></div>
		</el-dialog>
	</div>
</template>

<script>
	import { fatchList } from "@/api/vita/order.js";
	import waves from "@/directive/waves/index.js"; // 水波纹指令
	import { mapState, mapGetters } from "vuex";

	export default {
		name: "table_cms_verify",
		directives: {
			waves
		},
		data() {
			return {
				list: null,
				total: null,
				listLoading: false,
				listQuery: {
					pubState: '',
					state: '',
					startPage: 1,
					pageSize: 10
				},
				content: '',
				loading: false,
				buttonShow: false,
				dialogVisible: false,
				ids: [],
				sys_audit_confirm: false,
				sys_audit_refuse: false
			};
		},
		computed: {
			...mapGetters(["permissions"]),
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		filters: {
			statusFilter(state) {
				if(state) {
					const publishStateMap = {
						'1': "公开",
						'2': '部分公开',
						'3': '不公开'
					};
					return publishStateMap[state];
				}
			},
			payChannelFilter(state) {
				if(state) {
					const publishStateMap = {
						'1': "待审核 ",
						'2': '审核通过',
						'3': '审核失败'
					};
					return publishStateMap[state];
				}
			}
		},
		created() {
			this.sys_audit_confirm = this.permissions["confirm_article_publish"];
			this.sys_audit_refuse = this.permissions["refuses_article_publish"];
		},
		methods: {
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.list = null;
			},
			getList() {
				this.listLoading = true;
				this.buttonShow = false;
				fatchList(this.listQuery).then(res => {
					this.list = res.data.data.list;
					this.total = res.data.data.total;
					this.listLoading = false;
					if(this.total > 0)
						this.buttonShow = true;
				});
			},
			dialogDetail(id) {
				detailInfo({
					'id': id
				}).then(res => {
					this.dialogVisible = true
					this.content = res.data.data.content
					console.info(res.data)
				});
			},
			handleFilter(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.listQuery.startPage = 1;
						this.getList();
					} else {
						return false;
					}
				});
			},
			auditC() {
				this.$confirm('确认审核通过?', '数据审核', {
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					verifyConfirm({
						'ids': this.ids,
						'verifierId': this.userInfo.userId,
						'verifierName': this.userInfo.username
					}).then(res => {
						this.listLoading = false;
						let msg = '';
						if(res.data.status == 200) {
							msg = '审核成功'
							this.list = []
							this.getList()
						} else {
							msg = res.data.msg;
						}
						this.$alert(msg, '审核结果', {
							type: "success",
							center: true
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			auditR() {
				console.info(userInfo)
				this.$confirm('确认审核拒绝?', '数据审核', {
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;

					verifyRefuses({
						'ids': this.ids,
						'verifierId': this.userInfo.userId,
						'verifierName': this.userInfo.username
					}).then(res => {
						this.listLoading = false;
						let msg = '';
						if(res.data.status == 200) {
							msg = '审核已拒绝'
							this.list = []
							this.getList()
						} else {
							msg = res.data.msg;
						}
						this.$alert(msg, '审核结果', {
							type: "success",
							center: true
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			checkStatus(row, index) {
				if(row.state === '1')
					return true;
				return false;
			},
			handleSelectionChange(val, row) {
				this.ids = [];
				for(let i = 0; i < val.length; i++) {
					this.ids[i] = val[i].id
				}
			},
			selectionAll(val) {
				if(val.length == 0) {
					this.ids = [];
				} else {
					for(let i = 0; i < val.length; i++) {
						this.ids[i] = val[i].id
					}
				}
			},
			handleSizeChange(val) {
				this.listQuery.pageSize = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.startPage = val;
				this.getList();
			},
			cancel() {
				this.dialogVisible = false;
			}
		}
	};
</script>