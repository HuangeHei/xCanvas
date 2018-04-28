//基本类 待完善
class NewYuanSuBase{
    constructor(x,y,w,h){
        this.x = x // x
        this.y = y // y
        this.w = w // 宽度
        this.h = h // 高度
        this.T = this.y // 上
        this.L = this.x // 左
        this.B = this.y + this.h // 下
        this.R = this.x + this.w // 右
        this.reg()
        this.rot = 0 // 旋转需要用到的属性
        this.click = () =>{  console.log(this,"获取了点击") }
        this.updates = () =>{
            this.render()
        }
        
    }
    
    reg(xCanvas = window.xCanvas){
        if(xCanvas.regYuanSu(this)){
            console.log('注册成功')
        }
    }
    unreg(xCanvas = window.xCanvas){
        if(xCanvas.unregYuanSu(this)){
            console.log('解除成功')
            this.del()
        }
    }
    test_aabb(x,y){
        if((x > this.L && x < this.R) && (y > this.T && y <this.B)){
            return true
        }else{
            return false
        }
    }
    aabb_update(){
        this.T = this.y
        this.L = this.x
        this.B = this.y + this.h
        this.R = this.x + this.w
    }
    render(){
    }
    update(){
        this.aabb_update() // 更新aabb
        this.updates() // 执行开放updates
    }
    del(){
        delete this
    }

    rotation(angle,type="center",xCanvas = window.xCanvas){
        xCanvas.context.save()
        var save_x = this.x //
        var save_y = this.y
        if(type === 'left'){
            this.x = 0
            this.y = 0 
            xCanvas.context.translate(this.x,this.y);
        }else{
            var new_x = this.x + this.w / 2  // 以中点
            var new_y = this.y + this.h / 2  // 以中点 
            xCanvas.context.translate(new_x,new_y);
            this.x -= new_x 
            this.y -= new_y 
        }
        xCanvas.context.rotate(angle*Math.PI/180);
        this.render() // 渲染一次
        this.x = save_x
        this.y = save_y
        xCanvas.context.restore();
    }
    //click(callback){
      //  callback()
    //}
}

class JuXing extends NewYuanSuBase{ // 注意reg 注册的层级 z_index
    constructor(x,y,w,h,color='#000'){
        super(x,y,w,h)
        this.color = color // 设置颜色
        return this
    }
    render(xCanvas = window.xCanvas){
        
        xCanvas.context.fillStyle = this.color // 设置颜色
        xCanvas.context.fillRect(this.x,this.y,this.w,this.h)
        
        // 绘制一个填充矩形  开始的x点 和 开始的y点
    }
}
class World extends NewYuanSuBase{   // 渲染标题文字
    constructor(x,y,strBuff,color='#000',font="14px Arial",textAlign="center",textBaseline="middle"){
        super(x,y,0,0)
        this.strBuff = strBuff  // 设置内容
        this.font = font //设置 context font 属性 
        // "italic      small-caps   bold          12px       arial"  
        //  font-style  font-variant font-weight   font-size  font-family  
        this.textAlign = textAlign    
        // center | end | left | right | start
        this.textBaseline = textBaseline;
        this.w = xCanvas.context.measureText(this.strBuff).width + (this.strBuff.length*5)
        this.color = color // 设置颜色
        this.get_font_height()
        return this
    }
    get_font_height(){
        var strBuff = this.font.split(" ")
        for(var i in strBuff){
            var ret = strBuff[i].indexOf('px')
            if(ret != -1){
                this.h = Number(strBuff[i].slice(0,ret))
            }
        }
    }
    render(xCanvas = window.xCanvas){
        if(!this.maxWidth) // 如歌this.maxWidth 等于false 那么就用measureText 来计算内容的宽度
              //用measureText 来计算内容的宽度 但是默认是最小比例
        
        xCanvas.context.fillStyle = this.color // 设置颜色
        xCanvas.context.font = this.font  // created 中设置font
        xCanvas.context.textAlign = this.textAlign // created 中设置textAlign
        xCanvas.context.textBaseline = this.textBaseline// created 中设置textBaseline
        xCanvas.context.fillText(this.strBuff,this.x,this.y,this.maxWidth)// created 中进行渲染
        // "alphabetic  top  hanging  middle  ideographic  bottom";
        // 渲染tile 在 x点 50 y点 10  允许的最大宽度 maxWidth  
    }
    aabb_update(){ // text 的aabb 更新
        if(this.textBaseline === 'middle')
            this.L = this.x - this.w / 2 
        
        if(this.textAlign === 'center'){  
            this.T = this.y - this.h / 2
        }else{
            this.T = this.y
            this.L = this.x
        }
        this.B = this.T + this.h
        this.R = this.L + this.w
    }
}

class XCanvas{
    constructor(name,w,h,id,ctxM="2d",fps = 50){ // 默认Ctx_M 为2d
        this.dom = document.getElementById(id)  // 获取到 canvas 
        this.height = h    // 第一次预设 canvas 高度的值
        this.width = w     // 第一次预设 canvas 宽度的值
        this.ctxM = ctxM   // context 获取模式
        this.context  = this.x_canvas_init() // 初始化 canvas 大小
        this.name = name // 初始化 title 
        this.renderList = [] // 注册方法
        this.fps = fps // 初始化 fps 帧率
        this.frames = 0 // 帧数
        this.res = {} // 资源存稿
        this.loadingRes() // 加载资源
        this.loading_ok = false // 是否完成
        this.dom.onclick = this.click_distribute // 注册 onclick 事件
        this.scene_list = [] // 场景管理器列表
        this.scene = 0  // 当前场景号
        this.warn = ''
        
    }
    click_distribute(event,xCanvas = window.xCanvas){ // 点击事件分发
        var x = event.clientX - canvas.getBoundingClientRect().left // 获取点击的坐标点
        var y = event.clientY - canvas.getBoundingClientRect().top  // 获取点击的坐标点
        for(var i = 0 ; i < xCanvas.renderList.length ; i++){
            console.log("是",xCanvas.renderList[i],"获取到了点击")
            if(xCanvas.renderList[i].test_aabb(x,y)){ // 传入 x y 检测一哈
                xCanvas.renderList[i].click()
            }
        }
    }
    x_canvas_init(xCanvas = window.xCanvas){ // 初始化 canvas 画布
        this.dom.height = this.height   // 设置 canvas 高度
        this.dom.width =  this.width     // 设置 canvas 宽度
        return this.dom.getContext(this.ctxM) // 以2d模式获取上下文 并且返回 模式是规定好的有 2d 3d webgl
    }
    regYuanSu(YuanSu){// 注意reg 注册的层级 z_index
        this.renderList.push(YuanSu)  // 注册
        return true
    }
    unregYuanSu(YuanSu){
        this.renderList.splice(this.renderList.indexOf(YuanSu), 1); // 解除注册
        return true
    }
    clear_renderList(){ // 清空renderList
        for(var i = 0 ; i < this.renderList.length ; i++){
            this.renderList[i].del() // 调用其del方法
        }
        this.renderList = [] //清空
    }
    clear(x=0,y=0,width=this.width,height=this.height){
        window.xCanvas.context.clearRect(x,y,width,height) 
        // 清屏 开始x点  开始y点  清除的 宽度  高度
    }
    render(xCanvas = window.xCanvas){// 开始渲染当前场景所有注册过的
        for(var i = 0 ;i < xCanvas.renderList.length ;i++){
            xCanvas.renderList[i].render()
        }
        xCanvas.frames++ // 增加帧数
    }
    update(xCanvas = window.xCanvas){// 开始渲染所有注册过的
        for(var i = 0 ;i < xCanvas.renderList.length ;i++){
            xCanvas.renderList[i].update()
        }
        xCanvas.frames++ // 增加帧数
    }
    
    scene_tab(type="D"){

        // 场景控制器 前进还是后退
        if(type === 'D'){
            this.scene++// 场景++
        }else if (type === 'R'){
            this.scene--// 场景++
        }
        // ---------- end -----------

        if(this.scene < this.scene_list.length){
            this.clear_renderList() // 清空场景
           
            this.created() // created 只会执行一次 ，所以 我们要再次调用created
        }else{
            console.log('没有更多的场景进行更换了')
        }
    }
    created(){
        this.scene_list[this.scene]()
        console.log('场景渲染完成')
    }
    start(){
        this.created()
        setInterval(function(){
            window.xCanvas.clear() 
            window.xCanvas.update() // 清屏 开始x点  开始y点  清除的 宽度  高度
        },1000 / this.fps) // 延迟多少毫秒渲染一次  fps = 1000/16.6   常规为20ms一次 等于50帧
    }
    loadingRes(xCanvas = window.xCanvas){
       
        var xhr = new XMLHttpRequest()

        xhr.onreadystatechange = ()=>{
    
            if(xhr.readyState === 4){  //xhr.readyState 有五种状态 4 就是交互完成的状态 可以理解为 文件读取成功
                var res = JSON.parse(xhr.responseText)
 
                for(var key in res){
                    for(var item in res[key]){
                        var load = res[key][item]  // 获取当前字典
                        window.xCanvas.res[load.name] = new Image() // 设置xCanvas.res图片name
                        window.xCanvas.res[load.name].src = load.url // 设置xCanvas.res图片src
                        window.xCanvas.res[load.name].onload = ()=>{
                            // 图片载入完成后 你懂得
                        }
                    }
                }            
                window.xCanvas.start()
            }
        }
        xhr.open('get',"res.json",true)// res.json 文件
        xhr.send(null)
    }
}

var xCanvas = window.xCanvas = new XCanvas('One',1000,1000,"canvas")
xCanvas.scene_list = [
    ()=>{
        var obj = new JuXing(100,100,100,100,"green")
        obj.click = ()=>{
            console.log("成功获取进行场景切换")
            window.xCanvas.scene_tab() 
        }
        obj.updates = ()=>{
            obj.rotation(obj.rot)
            obj.rot--
        }
    },
    ()=>{
        var obj = new JuXing(50,50,100,100,"red")
        obj.click = ()=>{
            console.log("成功获取进行场景切换")
            window.xCanvas.scene_tab('R') 
        }
        obj.updates = ()=>{
            obj.rotation(obj.rot)
            obj.rot++
        }

    }
]




