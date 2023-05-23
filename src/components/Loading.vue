<template>
  <div class="loader">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
.loader {
  text-align: center;
  padding: 1em 0;
  --animationTime: 0.8s;
  --dotSize: 20px; 
}
.loader span {
  display: inline-block;
  vertical-align: middle;
  width: var(--dotSize);
  height: var(--dotSize);
  background: black;
  border-radius: var(--dotSize);
  animation: loader var(--animationTime) infinite alternate;
}
.loader span:nth-of-type(2) {
  animation-delay: 0.2s;
}
.loader span:nth-of-type(3) {
  animation-delay: 0.6s;
}
@keyframes loader {
  0% {
    opacity: 0.9;
    transform: scale(0.5);
  }
  100% {
    opacity: 0.1;
    transform: scale(1);
  }
}

</style>