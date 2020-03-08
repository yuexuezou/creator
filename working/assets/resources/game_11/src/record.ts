// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }

    // update (dt) {}
}

/*

    着色器 Shader

    顶点着色器 （3D图形由一个个三角面片租成）
        计算每个三角面片上的顶点 ？？？

    片断着色器 （像素着色器）
        以片断为单位、计算光照、颜色的一系列算法

    简单来说：Shader 其实就是一段代码，这段代码的作用是告诉GPU具体怎样去绘制模型的每一个顶点的颜色以及最终每一个像素点的颜色

    Shader 是一段代码，主要用这三种语言来写
    1.GLSL
        OpenGl Shading Language
    其他不写，会1种就够了

    Unity 3种Shader
    1.Surface Shaders 表面着色器
    2.Vertex/Fragment Shaders 顶点/片断着色器
    3.不重要



    解析effect

    GLSL

    基本类型
    void	跟C语言的void类似，表示空类型。作为函数的返回类型，表示这个函数不返回值。
    bool	布尔类型，可以是true 和false，以及可以产生布尔型的表达式。
    int	整型 代表至少包含16位的有符号的整数。可以是十进制的，十六进制的，八进制的。
    float	浮点型
    bvec2	包含2个布尔成分的向量
    bvec3	包含3个布尔成分的向量
    bvec4	包含4个布尔成分的向量
    ivec2	包含2个整型成分的向量
    ivec3	包含3个整型成分的向量
    ivec4	包含4个整型成分的向量
    mat2 或者 mat2x2	2×2的浮点数矩阵类型
    mat3或者mat3x3	3×3的浮点数矩阵类型
    mat4x4	4×4的浮点矩阵
    mat2x3	2列3行的浮点矩阵（OpenGL的矩阵是列主顺序的）
    mat2x4	2列4行的浮点矩阵
    mat3x2	3列2行的浮点矩阵
    mat3x4	3列4行的浮点矩阵
    mat4x2	4列2行的浮点矩阵
    mat4x3	4列3行的浮点矩阵
    sampler1D	用于内建的纹理函数中引用指定的1D纹理的句柄。只可以作为一致变量或者函数参数使用
    sampler2D	二维纹理句柄
    sampler3D	三维纹理句柄
    samplerCube	cube map纹理句柄
    sampler1DShadow	一维深度纹理句柄
    sampler2DShadow	二维深度纹理句柄

    结构体
    声明结构体
    struct testStruct{
        int aaa;
        bool bbb;
    };

    数组
    基本类型的数组
    也可以是结构体的数组

    修饰符
    变量的声明可以使用如下的修饰符。
        const                   常量值必须在声明是初始化。它是只读的不可修改的。

        attribute               表示只读的顶点数据，只用在顶点着色器中。数据来自当前的顶点状态或者顶点数组。
                                它必须是全局范围声明的，不能再函数内部。一个attribute可以是浮点数类型的标
                                量，向量，或者矩阵。不可以是数组或则结构体

        uniform                 一致变量。在着色器执行期间一致变量的值是不变的。与const常量不同的是，这个
                                值在编译时期是未知的是由着色器外部初始化的。一致变量在顶点着色器和片段着色
                                器之间是共享的。它也只能在全局范围进行声明。

        varying                 顶点着色器的输出。例如颜色或者纹理坐标，（插值后的数据）作为片段着色器的只
                                读输入数据。必须是全局范围声明的全局变量。可以是浮点数类型的标量，向量，矩
                                阵。不能是数组或者结构体。

        centorid varying        在没有多重采样的情况下，与varying是一样的意思。在多重采样时，
                                centorid varying在光栅化的图形内部进行求值而不是在片段中心的固定位置求值。

        invariant               (不变量)用于表示顶点着色器的输出和任何匹配片段着色器的输入，在不同的着色器
                                中计算产生的值必须是一致的。所有的数据流和控制流，写入一个invariant变量的
                                是一致的。编译器为了保证结果是完全一致的，需要放弃那些可能会导致不一致值的
                                潜在的优化。除非必要，不要使用这个修饰符。在多通道渲染中避免z-fighting可能
                                会使用到。

        in                      用在函数的参数中，表示这个参数是输入的，在函数中改变这个值，并不会影响对调
                                用的函数产生副作用。（相当于C语言的传值），这个是函数参数默认的修饰符

        out                     用在函数的参数中，表示该参数是输出参数，值是会改变的。

        inout                   用在函数的参数，表示这个参数即是输入参数也是输出参数。

    内置变量
        内置变量可以与固定函数功能进行交互。在使用前不需要声明。

            顶点着色器可用的内置变量如下表：

            名称	                    类型	                描述
            gl_Color	               vec4	                  输入属性-表示顶点的主颜色
            gl_SecondaryColor	       vec4	                  输入属性-表示顶点的辅助颜色
            gl_Normal	               vec3                	  输入属性-表示顶点的法线值
            gl_Vertex	               vec4	                  输入属性-表示物体空间的顶点位置
            gl_MultiTexCoordn	       vec4	                  输入属性-表示顶点的第n个纹理的坐标
            gl_FogCoord	               float	              输入属性-表示顶点的雾坐标
            gl_Position	               vec4	                  输出属性-变换后的顶点的位置，用于后面的固定的裁剪等操作。所有的顶点着色器都必须写这个值。
            gl_ClipVertex	           vec4	                  输出坐标，用于用户裁剪平面的裁剪
            gl_PointSize	           float	              点的大小
            gl_FrontColor	           vec4	                  正面的主颜色的varying输出
            gl_BackColor	           vec4	                  背面主颜色的varying输出
            gl_FrontSecondaryColor	   vec4	                  正面的辅助颜色的varying输出
            gl_BackSecondaryColor	   vec4	                  背面的辅助颜色的varying输出
            gl_TexCoord[]	           vec4	                  纹理坐标的数组varying输出
            gl_FogFragCoord	           float	              雾坐标的varying输出


            片段着色器的内置变量如下表：

            名称	                    类型	               描述
            gl_Color	               vec4	                  包含主颜色的插值只读输入
            gl_SecondaryColor	       vec4	                  包含辅助颜色的插值只读输入
            gl_TexCoord[]	           vec4	                  包含纹理坐标数组的插值只读输入
            gl_FogFragCoord	           float               	  包含雾坐标的插值只读输入
            gl_FragCoord	           vec4	                  只读输入，窗口的x,y,z和1/w
            gl_FrontFacing	           bool	                  只读输入，如果是窗口正面图元的一部分，则这个值为true
            gl_PointCoord	           vec2	                  点精灵的二维空间坐标范围在(0.0, 0.0)到(1.0, 1.0)之间，仅用于点图元和点精灵开启的情况下。
            gl_FragData[]	           vec4	                  使用glDrawBuffers输出的数据数组。不能与gl_FragColor结合使用。
            gl_FragColor	           vec4	                  输出的颜色用于随后的像素操作
            gl_FragDepth	           float	              输出的深度用于随后的像素操作，如果这个值没有被写，则使用固定功能管线的深度值代替



    成分选择
    向量中单独的成分可以通过 {x,y,z,w},    {r,g,b,a}   或者       {s,t,p,q}的记法来表示。
    这些不同的记法用于       顶点，        颜色，                 纹理坐标

        例子：
        vec3 myVec = {0.5, 0.35, 0.7};
        float r = myVec.r;
        float myYz = myVec.yz;
        float myQ = myVec.q;//出错，数组越界访问，q代表第四个元素
        float myRY = myVec.ry; //不合法，混合使用记法


    discard
    片段着色器中有一种特殊的控制流成为discard。使用discard会退出片段着色器，不执行后面的片段着色操作。片段也不会写入帧缓冲区。

    if (color.a < 0.9)
        discard;
    是否可以用下边的写法？
    if (color.a < 0.9){
        discard;
    }

    函数
        GLSL中的函数，必须是在全局范围定义和声明的。不能在函数定义中声明或定义函数。函数必须有返回类型，参数是可选的。参数的修饰符(in, out, inout, const等）是可选的。
            //函数声明
            bool isAnyNegative(const vec4 v);
            //函数调用void main(void)
            {
                bool isNegative = isAnyNegative(gl_Color);
            }
            //定义
            bool isAnyNegative(const vec4 v)
            {
                if (v.x < 0.0 || v.y < 0.0 || v.z < 0.0 || v.w < 0.0)
                    return true;
                else
                    return false;
            }
            三部分？声明 使用 定义
                先声明一个变量？
                main函数中就可以调用了
                该函数的实现放在main函数之后




    问题
        矩阵用来做啥？ 对角矩阵

        4×4矩阵？？
        左上角的2×2矩阵？？ 左上角？怎么判断的



    techniques:
    - passes:
        - vert: skybox-vs
          frag: skybox-fs
          rasterizerState:
            cullMode: none
    注意缩进  -是数组

    techniques: [{
        passes：[{
            vert: skybox-vs,
            frag: skybox-fs,
            rasterizerState: {
                cullMode: none,
            },

        }]
    }]

    &引用

    xxxx &xx      xx别名（定义）
    bbbb *xx      引用（使用）
    << :*xx       继承




*/