(()=>{
const arrow=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>`;
const check=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>`;
const phone=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 2-2 3-4 2A22 22 0 0 1 3 7C2 5 3 3 5 3Z"/></svg>`;
const sourceButton=(text='依据与来源')=>`<button class="text-button" data-source>${text} ↗</button>`;
const ruleButton=(q='',text='查阅相关规范')=>`<button class="text-button" data-rule="${q}">${text} ↗</button>`;
const note=(text)=>`<p class="boundary"><strong>判断边界</strong>${text}</p>`;
const label=(n,text)=>`<p class="chapter"><span>${n}</span>${text}</p>`;
const heading=(a,b='')=>`<div class="heading"><h2>${a}</h2>${b?`<p>${b}</p>`:''}</div>`;
const cols=(items)=>`<div class="columns">${items.map(([a,b,c])=>`<section><span class="index">${a}</span><h3>${b}</h3><p>${c}</p></section>`).join('')}</div>`;
const sourceCaption=(ids)=>`<p class="caption">差旅案例 ${ids} 重绘 · 非原产品截图</p>`;
const mockApproval=(done=false)=>`<div class="mock approval"><div class="mock-head"><span>出差申请</span><span class="status ${done?'done':''}">${done?'审批完成':'待审批'}</span></div><h3>国内出差申请</h3><dl><div><dt>行程</dt><dd>青岛 → 上海</dd></div><div><dt>申请事项</dt><dd>项目沟通</dd></div></dl><div class="mock-bottom">${done?`<p class="complete">${check} 已处理，无需重复审批</p>`:`<span class="mock-secondary">不通过</span><span class="mock-primary">通过</span>`}</div></div>`;
const signalData=[
 ['困惑','“这两个有什么区别？”','理解对象与位置','心智模型 · 信息架构','两个个人中心；需求单与订单的定位不清。','用户需要自行猜测系统划分，难以建立稳定理解。','名称能否说明对象？入口是否可区分？当前位置是否明确？','多个入口可以存在，但应解释区别。不能未经业务确认合并需求单与订单。','#32 / #33'],
 ['犹豫','“我应该点哪个？”','识别重点与下一步','视觉注意 · 信息层级','打印、退出登录的强调程度超过当前任务。','界面把注意力引向次要操作，用户需要重新筛选重点。','当前任务是什么？最醒目的操作是否与任务优先级一致？','不是每页都需要主按钮；高信息密度也不一定不合理。','#76 / #82'],
 ['意外','“怎么和想的不一样？”','预测操作结果','意符与映射 · 一致性','电话图标点开后，出现的是服务商列表。','图标暗示“直接联系”，实际行为却增加了一次选择。','图标、标签、控件形态是否兑现了用户操作前的预期？','可以通过明确文字解释行为；不需要所有按钮都采用同一种外观。','#41'],
 ['不耐烦','“为什么还要再来一次？”','降低额外负担','认知负荷 · 识别优于回忆','超标提示出现太晚；重复浮层打断阅读。','用户已完成选择，才发现限制，不得不回退、比较与重选。','信息是否及时可用？是否需要记住前页数据？重复操作是否必要？','并非所有信息都需首屏展开；减少点击也不能增加单步理解难度。','#20 / #27'],
 ['焦虑','“刚才到底成功了吗？”','确认进度与结果','状态可见性 · 反馈','机器人已完成审批，旧H5页面仍可以操作。','用户无法确定哪个状态可信，可能刷新、重复提交或找人确认。','执行中、成功、失败、结果未知是否分别表达？跨入口是否一致？','有Loading不代表反馈合格；后端防重无法消除前端的不确定感。','#12 / #13 / #63'],
 ['失控','“我还能取消吗？”','停止、退出与恢复','用户控制与自由 · 错误恢复','进入变更后没有取消入口，保存后无法回到原状态。','用户承担了不愿继续的任务，或者无法修正刚作出的决定。','取消、关闭、返回、撤回、撤销分别会影响什么？输入是否被保留？','不是所有业务状态都可撤销；无法恢复时需要提前说明并给出可行路径。','#85']
];
function signalArt(i){
 if(i===0)return `<div class="concept-map"><div><span class="small-label">入口 A</span><h3>个人中心</h3><p>个人信息 · 编辑</p></div><span class="map-question">?</span><div><span class="small-label">入口 B</span><h3>个人中心</h3><p>个人信息 · 编辑</p></div></div><p class="diagram-caption">对象相似，但关系没有被表达。</p>`;
 if(i===1)return `<div class="priority-art" x-data="{clear:false}"><div class="switch-line"><span>审批任务</span><button class="text-button" @click="clear=!clear" x-text="clear?'查看原问题':'查看调整思路'"></button></div><div class="document-lines"><i></i><i></i><i></i></div><div class="mock-actions"><span :class="clear?'mock-secondary':'mock-primary'">打印</span><span class="mock-secondary">返回</span><span :class="clear?'mock-primary':'mock-secondary'">审批</span></div><p class="diagram-caption" x-text="clear?'强调与当前任务一致。':'次要动作吸引了更多注意。'"></p></div>`;
 if(i===2)return `<div class="expectation-art"><div class="phone-control">${phone}</div><div class="expectation"><span>预期</span><strong>直接联系</strong></div><div class="actual"><span>实际</span><strong>选择服务商</strong><div><p>服务商 A</p><p>服务商 B</p><p>服务商 C</p></div></div></div>`;
 if(i===3)return `<div class="journey"><div><span>选择酒店</span><b>已选好</b></div><div><span>进入详情</span><b>才发现超标</b></div><div><span>返回列表</span><b>重新比较</b></div><svg viewBox="0 0 900 100" preserveAspectRatio="none" aria-label="从返回列表回到选择酒店"><path d="M760 4V45Q760 76 720 76H180Q140 76 140 36V4m-8 12 8-12 8 12"/></svg></div>`;
 if(i===4)return `<div class="state-art"><div>${check}<strong>机器人：已审批</strong></div><div><span class="state-dot"></span><strong>H5：仍待审批</strong></div></div>`;
 return `<div class="recovery-art"><span>原申请</span><i>${arrow}</i><strong>变更中</strong><i>${arrow}</i><span>保存变更</span><div class="missing-return">返回原状态的路径在哪里？</div></div>`;
}

window.UX_ART={signal:signalArt,approval:mockApproval,arrow,check};

})();
