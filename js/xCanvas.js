

export class XCanvas{
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
        this.res = {}
        this.loadingRes()
        this.loading_ok = false
        this.dom.onclick = this.click_distribute // 注册 onclick 事件
    }
    click_distribute(event,xCanvas = window.xCanvas){
        var x = event.clientX - canvas.getBoundingClientRect().left // 获取点击的坐标点
        var y = event.clientY - canvas.getBoundingClientRect().top  // 获取点击的坐标点
        
        for(var i = 0 ; i < xCanvas.renderList.length ; i++){
            console.log(xCanvas.renderList[i])
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
    clear(x=0,y=0,width=this.width,height=this.height){
        window.xCanvas.context.clearRect(x,y,width,height) 
        // 清屏 开始x点  开始y点  清除的 宽度  高度
    }
    render(xCanvas = window.xCanvas){// 开始渲染所有注册过的
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
    created(){
        new World(50,50,"你好")
        new JuXing(100,100,50,50,"red")
        window.xCanvas.render() // render 渲染出所有注册的
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
