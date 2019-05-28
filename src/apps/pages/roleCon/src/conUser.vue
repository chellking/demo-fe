<template>
		<div>
			<div class="persioncontain" >
				<div class="persionbox"  v-for="(app,inx) in users">
					
					<div class="persionbox-remove"  v-if = "showIconCut">
						<i class="ifbp-icon-power-off el-icon-circle-close" @click="handleChange(app,inx)"></i>
					</div>
					<div class="persionbox-remove" v-if = "showIconAdd">
						<div style = "height: 18px;width: 18px;border-radius:50%;background: #5CB0E6;">
							<i class="ifbp-icon-add" @click = "handleChange(app,inx)"></i>
						</div>
						
					</div>
					
					<img :src="'/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar='+app.avatar">
	
					<div class="usermessage">
						<span style="font-size: 16px;color: #333333;line-height: 24px;">{{app.user_code}}</span><br />
						<span style="font-size: 14px;color: #666666;">{{app.user_code}}</span>
					</div>
				</div>	
			</div>
		</div>
</template>

<script>
	export default {
		name: 'conUser',
		data() {
			return {}
		},		
		props: {
			users:{
				type: Array,
				default:''
			},
			showIconAdd:{
				type:Boolean,
				default:false
			},
			showIconCut:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			handleChange(app,inx){
				this.$emit('handleChange',app,inx)
			}
			
		}
	}
	
</script>

<style>
.persioncontain{
	display: -webkit-flex;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-left: 8px;
}
.persionbox {
	height: 96px;
	width: 264px;
	position: relative;
	background: #FFFFFF;
	border: 1px solid #E6E6EB;
	border-radius: 4px;
	margin: 8px;
}
.persionbox:hover{
	background: rgba(243,246,249,0.50);
	border: 1px solid #F0F0F5;
	box-shadow: 0 2px 4px 0 #E2E8EF;
	border-radius: 4px;
}
.persionbox img{
    display: block;
    float: left;
    height: 48px;
    width: 48px;
    border-radius: 50%;
	margin: 24px;
}
.persionbox .usermessage {
    float: left;
    line-height: 18px;
    height: 48px;
    margin-top: 24px;
}
.persionbox .usermessage span{
    width: 150px;
    display: inline-block;
    margin-left: 8px;
    vertical-align: text-bottom;
    margin-right: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.persionbox-remove{
	position: absolute;
	top: 8px;
	right:8px;
	display: none;
}
.persionbox:hover .persionbox-remove{
	display: block;
}
.ifbp-icon-power-off{
    color: #C8C8CD;
}
.ifbp-icon-add{
	color: white;
}
</style>