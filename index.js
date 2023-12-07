//получаю кнопки сортировки и вешаю лисенеры
const sortByTitleBtn = document.querySelector(".btn-sort-title");
sortByTitleBtn.addEventListener("click", sortByJobTitle);
const sortByJobSalary = document.querySelector(".btn-sort-salary");
sortByJobSalary.addEventListener("click", sortBySalary);
const resetBtn = document.querySelector(".btn-reset");
resetBtn.addEventListener("click", resetFilters);

const modalContainer = document.querySelector("#modal-container");

// Функция для создания и показа первого модального окна
const showFirstModal = (vacancy) => {
  console.log(vacancy);
  const modal = `
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              <p>${vacancy.description}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-respond">Откликнуться</button>
              </div>
            </div>
          </div>
        </div>`;

  modalContainer.innerHTML = modal;

  // Инициализация первого модального окна
  const modalInstance = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );
  modalInstance.show();

  // Обработчик для кнопки "Откликнуться"
  document.querySelector(".btn-respond").addEventListener("click", (event) => {
    event.preventDefault();
    showModalForm();
  });
};

// Функция для создания и показа второго модального окна
const showModalForm = () => {
  const modalForm = `
        <div class="modal fade" id="respondModal" tabindex="-1" aria-labelledby="respondModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="text-center">Заполните ваши данные</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              <div class="container">
              <form id="respondForm" class="row g-3 justify-content-center needs-validation" novalidate>
              <div class="col-md-6">
                <label for="surname" class="form-label">Фамилия</label>
                <input type="text" class="form-control" id="surname" placeholder="Ваша фамилия" required>
                <div class="invalid-feedback">
                  Пожалуйста, введите фамилию.
                </div>
              </div>
        
              <div class="col-md-6">
                <label for="name" class="form-label">Имя</label>
                <input type="text" class="form-control" id="name" placeholder="Ваше имя" required>
                <div class="invalid-feedback">
                  Пожалуйста, введите имя.
                </div>
              </div>
        
              <div class="col-md-6">
                <label for="patronymic" class="form-label">Отчество</label>
                <input type="text" class="form-control" id="patronymic" placeholder="Ваше отчество" required>
                <div class="invalid-feedback">
                  Пожалуйста, введите отчество.
                </div>
              </div>
        
              <div class="col-md-6">
                <label for="email" class="form-label">Почта</label>
                <input type="email" class="form-control" id="email" placeholder="example@example.ru" required>
                <div class="invalid-feedback">
                  Пожалуйста, введите почту.
                </div>
              </div>
        
              <div class="col-md-6">
                <label for="phone" class="form-label">Телефон</label>
                <input type="tel" class="form-control" id="phone" placeholder="+7(9XX)-XXX-XX-XX">
              </div>
        
              <div class="col-12 text-center">
                <button type="submit" class="btn btn-primary">Отправить</button>
              </div>
        
            </form>
              </div>
              </div>
            </div>
          </div>
        </div>`;

  modalContainer.innerHTML = modalForm;

  // Инициализация второго модального окна
  const modalFormInstance = new bootstrap.Modal(
    document.querySelector("#respondModal")
  );
  modalFormInstance.show();
  // document
  //   .querySelector("#respondModal")
  //   .addEventListener("hidden.bs.modal", function () {
  //     document.querySelector(".modal-backdrop")?.remove();
  //   });

  document
    .querySelector("#respondModal")
    .addEventListener("hidden.bs.modal", function () {
      document.querySelector(".modal-backdrop")?.remove();
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    });

  const form = document.querySelector("#respondForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const formData = {
        Фамилия: document.getElementById("surname").value,
        Имя: document.getElementById("name").value,
        Отчество: document.getElementById("patronymic").value,
        Почта: document.getElementById("email").value,
        Телефон: document.getElementById("phone").value,
      };

      fetch("http://localhost:8080/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Error:", data.error);
          } else if (data.success) {
            console.log("Success:", data.success);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }

    form.classList.add("was-validated");
  });
};

// Обработчик событий для кнопки, которая показывает первое модальное окно
const detailBtns = document.querySelectorAll(".btn-show-modal");

detailBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    showFirstModal();
  });
});
// });

const vacanciesPerPage = 5;
const totalVacancies = 107;
const totalPages = Math.ceil(totalVacancies / vacanciesPerPage);

//////////////////////////////

// Функция для создания пагинации
function createPagination() {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ""; // Очистка предыдущих ссылок

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item";
    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.textContent = i;

    pageLink.addEventListener("click", (event) => {
      event.preventDefault();
      loadVacancies(i);
    });

    pageItem.appendChild(pageLink);
    paginationContainer.appendChild(pageItem);
  }
}
let currentVacancies = []; //текущий отфильтрованный массив вакансий

// Обновлённая функция loadVacancies
function loadVacancies(page = 1) {
  fetch("http://localhost:8080/api/vacancies")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      currentVacancies = data.source.vacancies[0].vacancy; // Инициализируем currentVacancies
      const start = (page - 1) * vacanciesPerPage;
      const end = start + vacanciesPerPage;
      displayVacancies(currentVacancies.slice(start, end));
      createPagination();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

let isSortedByTitleAsc = true;
let isSortedBySalaryAsc = true;

//ф-ция сортировки по названию вакансии
function sortByJobTitle() {
  if (isSortedByTitleAsc) {
    currentVacancies.sort((a, b) =>
      b["job-name"][0].localeCompare(a["job-name"][0])
    );
    isSortedByTitleAsc = false;
  } else {
    currentVacancies.sort((a, b) =>
      a["job-name"][0].localeCompare(b["job-name"][0])
    );
    isSortedByTitleAsc = true;
  }
  displayVacancies(currentVacancies.slice(0, vacanciesPerPage));
  createPagination();
}

//ф-ция сортировки по размеру зарплаты
function sortBySalary() {
  // Фильтруем, чтобы не показывать вакансии без ЗП
  const filteredVacancies = currentVacancies.filter(
    (vacancy) => vacancy.salary && vacancy.salary[0]
  );

  if (isSortedBySalaryAsc) {
    filteredVacancies.sort((a, b) => {
      const salaryA = parseInt(a.salary[0]);
      const salaryB = parseInt(b.salary[0]);
      return salaryB - salaryA;
    });
    isSortedBySalaryAsc = false;
  } else {
    filteredVacancies.sort((a, b) => {
      const salaryA = parseInt(a.salary[0]);
      const salaryB = parseInt(b.salary[0]);
      return salaryA - salaryB;
    });
    isSortedBySalaryAsc = true;
  }
  displayVacancies(filteredVacancies.slice(0, vacanciesPerPage));
  createPagination();
}

//ф-ция для сброса фильтров
function resetFilters() {
  loadVacancies(1);
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  loadVacancies(1);
});

//////////////////////////////
//ф-ция для отображения вакансий
const vacanciesContainer = document.querySelector(".vacancies-container");
function displayVacancies(vacancies) {
  //временно
  const displayedVacancies = vacancies.slice(0, 5);

  let vacanciesHTML = '<div class="row">';
  displayedVacancies.forEach((elem, index) => {
    const columnClass = index < 3 ? "col-md-4 mb-2" : "col-md-6 mb-3 ";
    vacanciesHTML += `
    <div class="${columnClass} rounded-2 ">
      <div class="card h-100 m-2"> 
        <div class="card-body d-flex flex-column align-items-center justify-content-center">
          <h5 class="card-title border border-info border-2 rounded-2 p-1 text-center">${elem["job-name"][0]}</h5>
          <p class="card-text">${elem.salary[0]}</p>
          <button class="btn btn-primary btn-show-modal" data-id="${index}">Подробнее</button>
          </div>
      </div>
    </div>`;
  });

  vacanciesHTML += "</div>";
  vacanciesContainer.innerHTML = vacanciesHTML;

  displayedVacancies.forEach((elem, index) => {
    const btn = document.querySelector(`.btn-show-modal[data-id="${index}"]`);
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      showFirstModal(elem);
    });
  });
}
