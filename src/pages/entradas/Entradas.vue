<template>
  <section class="tickets-page">
    <div class="tickets-content">
      <h1 class="tickets-title font-monument">CONSIGUE TU ENTRADA</h1>

      <form class="tickets-form">
        <input
          class="tickets-input"
          type="email"
          placeholder="INTRODUCE TU E-MAIL"
          aria-label="Introduce tu e-mail"
        />
        <button class="tickets-button font-monument" type="submit">ENTER</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.tickets-page {
  min-height: 100vh;
  background-color: black;
  color: white;
}

.tickets-content {
  width: min(820px, calc(100% - 64px));
  padding-top: 45vh;
  margin-left: 32px;
}

.tickets-title {
  margin-bottom: 28px;
  font-size: 42px;
  font-weight: 400;
  line-height: 1.05;
}

.tickets-form {
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  border: 1px solid white;
}

.tickets-input {
  min-width: 0;
  border: 0;
  background-color: transparent;
  color: white;
  font: inherit;
  padding: 18px 20px;
  outline: none;
}

.tickets-input::placeholder {
  color: white;
  opacity: 1;
}

.tickets-button {
  border: 0;
  border-left: 1px solid white;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  padding: 18px 24px;
}
</style>
