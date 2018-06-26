<template>
	<div id="app">

		<div class="face-code">
			<div class="face"><img :src="headimgurl" alt="" /></div>
			<div class="nickname">{{nickName}}</div>
			<div class="code" @click="erCode"></div>
		</div>
		<div class="item">
			<div class="input-box">
				<div class="icon">
					<img src="./assets/person.png" width="16px" height="17px" />
				</div>
				<div class="name">真实姓名</div>
				<div class="input">
					<input type="text" v-model="name" />
				</div>
			</div>
		</div>
		<div class="item">
			<div class="input-box">
				<div class="icon">
					<img src="./assets/phone.png" width="18px" height="17px" />
				</div>
				<div class="name">电话</div>
				<div class="input">
					<input type="number" v-model="phone" />
				</div>
			</div>
			<div class="input-box">
				<div class="icon">
					<img src="./assets/liwu.png" width="18px" height="17px" />
				</div>
				<div class="name">邀请码</div>
				<div class="input">
					<input type="text" style="color: #ff9702;" v-model="invitationCode" disabled="disabled" />
				</div>
			</div>
			<div class="input-box">
				<div class="icon">
					<img src="./assets/tui.png" width="18px" height="17px" />
				</div>
				<div class="name">推荐码</div>
				<div class="input">
					<input type="text" v-model="referralCode" />
				</div>
			</div>
		</div>
		<div class="item">
			<div class="input-box">
				<div class="icon">
					<img src="./assets/type.png" width="16px" height="13px" />
				</div>
				<div class="name">类型</div>
				<div class="input">
					<input type="text" style="color: #ff9702;" v-model="channel" :readonly="true" />
				</div>
			</div>
		</div>
		<mt-popup v-model="popupVisible" position="bottom" class="city-popup">
			<div class="cancle-confrim">
				<div @click="cancle">取消</div>
				<div @click="confrim">确定</div>
			</div>
			<mt-picker :slots="slots" @change="onMyAddressChange"></mt-picker>
		</mt-popup>
		<mt-popup v-model="isCode" position="right" :modal="false" class="mint-popup-1">
			<mt-header title="个人名片">
				<mt-button icon="back" slot="left" @click="close">返回</mt-button>
			</mt-header>
			<div class="code-item">
				<div class="face-code">
					<div class="face"><img :src="headimgurl" alt="" /></div>
					<div class="nickname">{{nickName}}的二维码</div>
				</div>

				<div class="er-code" id="qrcode" ref="qrcode">
				</div>
			</div>
		</mt-popup>
		<!--<mt-cell title="头像">
			<span class="icon" @click="erCode"><img :src="headimgurl" alt="" /></span>
		</mt-cell>
		<mt-field label="昵称" placeholder="" v-model="nickName" :disabled="nickName != null"></mt-field>
		<mt-field label="电话" placeholder="" type="number" v-model="phone"></mt-field>
		<mt-field label="邀请码" placeholder="" v-model="invitationCode" disabled="disabled"></mt-field>
		<mt-field label="推荐码" placeholder="" v-model="referralCode"></mt-field>

		<mt-field label="类型" placeholder="" v-model="channel" :readonly="true" @click.native="selectCity"></mt-field>
-->
		<div class="btn" @click="submit">修改</div>
	</div>
</template>

<script>
	import QRCode from 'qrcodejs2'
	import { UserInfo, Edit } from './components/api/user'
	import { getQueryString, ShowToast, Loading } from './components/api/common'
	export default {
		name: 'App',
		components: {
			QRCode
		},
		data() {
			return {
				headimgurl: '',
				name: '',
				nickName: '',
				phone: '',
				invitationCode: '',
				referralCode: '',
				channel: '',
				slots: [{
					flex: 1,
					values: ['生产线', '经销商', '设计师', '其他'],
					className: 'slot1',
					textAlign: 'center'
				}],
				popupVisible: false,
				isCode: false,
				value: '',
				//openId: 'oKDYO1Ut6llB3R9qd4MHyy9F5Ous',
				openId: '',
				id: '',
				
				now: 0,
			}
		},
		methods: {
			close() {
				this.isCode = false;
			},
			qrcode() {
				let qrcode = new QRCode('qrcode', {
					width: 190, // 设置宽度 
					height: 190, // 设置高度
					text: `http://www.argesz.com/yazhe/common/author?rcode=${this.invitationCode}&type=9`
				})
			},
			erCode() {
				this.isCode = true;
				if(this.now >= 1){
					return
				}
				this.$nextTick(_ => {
					this.now++;
					this.qrcode();
				})
			},
			onMyAddressChange(picker, values) {
				this.value = values;
			},
			selectCity() {
				//	this.popupVisible = true;
			},
			cancle() {
				this.popupVisible = false;
			},
			confrim() {
				this.popupVisible = false;
				this.channel = this.value[0];
			},
			submit() {
				if(this.phone === '') {
					ShowToast('请输入电话');
					return;
				}
				if(this.channel === '') {
					ShowToast('请选择类型');
					return;
				}
				let options = {
					id: this.id,
					name: this.name,
					phone: this.phone,
					referralCode: this.referralCode,
				}
				//				if(this.channel === '生产线') {
				//					options.channel = 1;
				//				}
				//				if(this.channel === '经销商') {
				//					options.channel = 2;
				//				}
				//				if(this.channel === '设计师') {
				//					options.channel = 3;
				//				}
				//				if(this.channel === '其他') {
				//					options.channel = 0;
				//				}
				Loading();
				Edit(options).then(res => {
					Loading(true);
					if(res.data.code === 0) {
						ShowToast('修改成功');
					} else {
						ShowToast(res.data.msg);
					}
				}).catch(res => {
					Loading(true);
				})
			}
		},
		created() {
			this.openId = getQueryString('openId');
			if(this.openId == null) {
				window.location.href = 'http://www.argesz.com/yazhe/common/author?type=2';
			}
		},
		mounted() {
			this.$nextTick(() => { //vue里面全部加载好了再执行的函数  （类似于setTimeout）
				this.slots[0].defaultIndex = 0
				// 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
				//因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
			});
			Loading();
			UserInfo(this.openId).then(res => {
				console.log(res);
				if(res.data.code === 0) {
					Loading(true)
					let data = res.data.data;
					this.headimgurl = data.headimgurl;
					this.nickName = data.nickName;
					this.name = data.name;
					this.invitationCode = data.invitationCode;
					this.referralCode = data.referralCode;
					this.id = data.id;
					this.phone = data.phone;
					if(data.channel === 1) {
						this.channel = '生产线'
					}
					if(data.channel === 2) {
						this.channel = '经销商'
					}
					if(data.channel === 3) {
						this.channel = '设计师'
					}
					if(data.channel === 0) {
						this.channel = '其他'
					}
				}
			}).catch(res => {
				Loading(true)
			})
		}
	}
</script>

<style scoped>
	#app{
		width: 100%;
		overflow: hidden;
	}
	.city-popup {
		width: 100%;
	}
	
	.cancle-confrim {
		display: flex;
		text-align: right;
		padding: 10px;
	}
	
	.cancle-confrim>div {
		flex: 1;
	}
	
	.cancle-confrim>div:nth-of-type(1) {
		text-align: left;
	}
	/*	/*
	.icon {
		display: block;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		overflow: hidden;
	}*/
	
	.item {
		background: #fff;
	}
	
	.item:nth-of-type(3) {
		margin: 9px 0;
	}
	
	.item:nth-of-type(2) .input-box,
	.item:nth-of-type(4) .input-box {
		border-bottom: 0;
	}
	
	.item:nth-of-type(3) .input-box:nth-of-type(3) {
		border-bottom: 0;
	}
	
	.input-box {
		display: flex;
		height: 50px;
		align-items: center;
		border-bottom: 1px solid #e1e1e1;
		margin-left: 15px;
	}
	
	.input-box .icon {
		flex: 0 0 18px;
		width: 18px;
	}
	
	.input-box .name {
		flex: 0 0 60px;
		width: 60px;
		color: #4c3622;
		font-size: 15px;
		margin-left: 15px;
		margin-right: 90px;
	}
	
	.input-box .input {
		flex: 1;
	}
	
	.input-box .input input {
		width: 100%;
		height: 100%;
		border: 0;
		font-size: 15px;
	}
	
	.face-code {
		padding: 9px 15px;
		background: #fff;
		border-top: 1px solid #e1e1e1;
		border-bottom: 1px solid #e1e1e1;
		display: flex;
		align-items: center;
		margin: 20px 0 10px 0;
	}
	
	.face-code .face {
		flex: 0 0 65px;
		width: 65px;
		height: 65px;
		margin-right: 16px;
	}
	
	.face-code .nickname {
		flex: 1;
		font-size: 16px;
		color: #333;
	}
	
	.face-code .code {
		flex: 0 0 19px;
		width: 19px;
		height: 19px;
		margin-right: 10px;
		background: url(./assets/er-code.png) no-repeat center center;
		background-size: 19px 19px;
	}
	
	.face-code .face img {
		width: 100%;
		height: 100%;
	}
	
	.btn {
		width: 90%;
		height: 40px;
		line-height: 40px;
		color: #fff;
		text-align: center;
		border-radius: 2px;
		background: #4c3622;
		margin: 20px auto;
	}
	
	.mint-popup-1 {
		width: 100%;
		height: 100%;
		overflow: scroll;
		background: #2b2b2b;
	}
	
	.code-item {
		width: 325px;
		height: 400px;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-top: -200px;
		margin-left: -162px;
		background: url(./assets/er-bg.png) no-repeat center center;
		background-size: 325px 400px;
	}
	
	.code-item .face-code {
		border: 0;
		padding: 0;
		padding-left: 10px;
	}
	
	.er-code {
		width: 190px;
		height: 190px;
		margin: 60px auto 0 auto;
	}
	
	.er-code img {
		width: 190px;
		height: 190px;
	}
</style>