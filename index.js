"use strict";
//in order to work with the existing API some notations refer to room instead of car and area instead of year but interface is setup to show car and year

class CarLot {
  constructor(name) {
    this.name = name;
    this.rooms = [];//using rooms to coordinate with API
  }

  
  addCar(name, area) {//using room and area to coordinate with API
    this.room.push(new Car(name, area));
  }
}

class Car {//using area to coordinate with API
  constructor(name, area) {
    this.name = name;
    this.area = area;
  }
}

class CarLotServices {
  static url = "https://ancient-taiga-31359.herokuapp.com/api/houses";

  static getAllCarLots() {
    return $.get(this.url);
  }

  static getCarLot(id) {
    return $.get(this.url + `/${id}`);
  }
  static createCarLot(carLot) {
    return $.post(this.url, carLot);
  }

  static updateCarLot(carLot) {
    return $.ajax({
      url: this.url + `/${carLot._id}`,
      dataType: "json",
      data: JSON.stringify(carLot),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteCarLot(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static carLots;

  static getAllCarLots() {
    CarLotServices.getAllCarLots().then((carLots) => this.render(carLots));
  }

  static createCarLot(name) {
    CarLotServices.createCarLot(new CarLot(name))
      .then(() => {
        return CarLotServices.getAllCarLots();
      })
      .then((carLots) => this.render(carLots));
  }

  static deleteCarLot(id) {
    CarLotServices.deleteCarLot(id)
      .then(() => {
        return CarLotServices.getAllCarLots();
      })
      .then((carLots) => this.render(carLots));
  }

  static addCar(id) {
    for (let carLot of this.carLots) {
      if (carLot._id == id) {
        carLot.rooms.push(
          new Car(
            $(`#${carLot._id}-room-name`).val(),
            $(`#${carLot._id}-room-area`).val()
          )
        );
        CarLotServices.updateCarLot(carLot)
          .then(() => {
            return CarLotServices.getAllCarLots();
          })
          .then((carLots) => this.render(carLots));
      }
    }
  }

  static deleteCar(carLotId, roomId) {
    for (let carLot of this.carLots) {
      if (carLot._id == carLotId) {
        for (let room of carLot.rooms) {
          if (room._id == roomId) {
            carLot.rooms.splice(carLot.rooms.indexOf(room), 1);
            CarLotServices.updateCarLot(carLot)
              .then(() => {
                return CarLotServices.getAllCarLots();
              })
              .then((carLots) => this.render(carLots));
          }
        }
      }
    }
  }

  static render(carLots) {
    this.carLots = carLots;
    $("app").empty();
    for (let carLot of carLots) {//removed this.
      $("#app").prepend(
        `<div id="${carLot._id}" class="card">
            <div class="card-header"> 
                <h2>${carLot.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteCarLot('${carLot._id}')">Delete</button>
            </div>
            <div class="card-body">
                <div class="card">
                    <div class="row">
                        <div class="col-sm">
                            <input type="text" id="${carLot._id}-room-name" class="form-control" placeholder="Car Make And Model">
                        </div>
                        <div class="col-sm">
                            <input type="text" id="${carLot._id}-room-area" class="form-control" placeholder="Year">
                        </div>
                
                        </div>
                        <button id="${carLot._id}-new-room" onclick="DOMManager.addCar('${carLot._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
            </div>
        </div><br>`
      );
      for (let room of carLot.rooms) {
        $(`#${carLot._id}`).find(".card-body").append(
          `<p>
                <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                <span id="year-${room._id}"><strong>Year: </strong> ${room.area}</span>
                <button class="btn btn-danger" onclick="DOMManager.deleteCar('${carLot._id}', '${room._id}')">Mark As Sold</button> </p>`
        );
      }
    }
  }
}
$("#create-new-carLot").on("click", () => {
  DOMManager.createCarLot($("#new-carLot-name").val());
  $("#new-carLot-name").val("");
});

DOMManager.getAllCarLots();
