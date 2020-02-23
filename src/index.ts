import "reflect-metadata";
import { createConnection } from "typeorm";
import { Photo } from "./entity/Photo";

createConnection({
  type: "sqlite",
  database: "db.sqlite3",
  entities: ["src/entity/**/*.ts"],
  synchronize: true,
  logging: true
})
  .then(async connection => {
    let photoRepository = connection.getRepository(Photo);

    let photoToRemove = await photoRepository.findOne(1);
    await photoRepository.remove(photoToRemove!);

    let [allPhotos, photosCount] = await photoRepository.findAndCount({
      isPublished: true
    });
    console.log("All photos: ", allPhotos);
    console.log("Photos count: ", photosCount);
  })
  .catch(error => console.log(error));
