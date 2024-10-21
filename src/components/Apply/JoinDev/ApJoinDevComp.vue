<script setup lang="ts">

</script>

<template>
  <div class="need_to_know_box">
    <h3>志愿加入奶果的须知</h3>
    <hr/>
    <div class="text_box">
      <h4>一、保持对计算机技术的爱好</h4>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎对计算机技术爱好的同学，但软件开发的过程并非轻松，您需要对您喜欢的技术保持一颗持之以恒的心。</p>
      <h4>二、为奶果贡献一份您的力量</h4>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;奶果是公益服务项目，不产生收益，而一个人的力量总归有限。期望您的到来，也能为奶果贡献一份力量，共同开发。</p>
      <h4>三、开发请遵守计算机行业法规</h4>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;志愿加入奶果后，请在未来开发中遵守《中华人民共和国民法典》、《中华人民共和国网络安全管理条例》等相关规定和国际互联网规定。</p>
      <h4>四、知识权</h4>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在您为奶果开始贡献开发时，将会著名、注册您的信息以公示，但由于是公益项目，我们不会将您的知识成果归为己有，您可以正常在个人商业中注册专利，但由于您的知识成果曾是以奶果为摇篮逐渐成型到自己立项，您需要与我们签订合同允许我们继续公益使用您的知识成果。</p>
      <h4>五、清退</h4>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在您注册开发者、见习开发者后，超过90个自然日不在【加入奶果、共同学习】https://naigos.cn/apply中发布笔记、提送成果，将会清退您的开发者、见习开发者资格。（90个自然日内提交一次，将不会再被清退。）</p>
      <h4>六、证明材料</h4>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在您注册开发者、见习开发者并产生笔记、成果后，在您生活中的必要时可以在【实习证明、学习证明】中申请您的公章证明材料，以作为您的个人经验。（由哈尔滨喵羽网络科技有限公司盖发。）</p>
      <div class="button_box">
        <button>我已熟悉以上须知，签订契约</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes need_to_know_box_in
  0%
    opacity: 0
    transform: translateY(-10px)
  100%
    opacity: 1
    transform: translateY(0)
@mixin need_to_know_box_in_ani()
  animation: need_to_know_box_in .8s ease forwards
.need_to_know_box
  @include need_to_know_box_in_ani()
  width: 70%
  margin: 20px auto 0 auto
  padding: 1% 3%
  border-radius: 10px
  background-color: #ffffff95
  h3
    text-align: center
  .text_box
    .button_box
      width: 100%
      text-align: center
      button:hover
        background-color: #e897dd
        cursor: pointer
      button
        width: 220px
        height: 40px
        background-color: #c572b9
        border: none
        color: white
        border-radius: 5px
        transition: .3s ease
</style>