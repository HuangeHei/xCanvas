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
    
    click(callback){
        callback()
    }
}

class JuXing extends NewYuanSuBase{ // 注意reg 注册的层级 z_index
    constructor(x,y,w,h,color='#000'){
        super(x,y,w,h)
        this.color = color // 设置颜色
    }
    render(xCanvas = window.xCanvas){
        
        xCanvas.context.fillStyle = this.color // 设置颜色
        xCanvas.context.fillRect(this.x,this.y,this.w,this.h)
        
        // 绘制一个填充矩形  开始的x点 和 开始的y点
    }
    update(){
        this.aabb_update()
        this.rotation(this.rot)  
        this.rot++
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
    update(){
        this.aabb_update(this)
        this.rotation(this.rot)
        this.rot--  
    }
    aabb_update(){
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