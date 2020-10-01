import "reflect-metadata";
import { createConnection } from "typeorm";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";

createConnection({
  type: "sqlite",
  database: "db.sqlite3",
  entities: ["src/entity/**/*.ts"],
  synchronize: true,
  logging: true,
})
  .then(async (connection) => {
    const photo = Photo.fake({ name: "Test" });
    const metadata = PhotoMetadata.fake();
    photo.metadata = metadata; // this way we connect them

    const photoRepository = connection.getRepository(Photo);

    // saving a photo also save the metadata
    await photoRepository.save(photo);

    console.log("Photo is saved, photo metadata is saved too.");

    const photos = await connection
      .getRepository(Photo)
      .createQueryBuilder("photo")
      .innerJoinAndSelect("photo.metadata", "metadata")
      .getMany();

    console.log(photos);
  })
  .catch((error) => console.log(error));
