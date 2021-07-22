import React, { useState, useEffect, useRef } from "react";
import Dropzone from "react-dropzone";
import slugify from "slugify";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Admin from "layouts/Admin.js";
import { getSession } from "next-auth/client";

import {
  productSubCategoryOptions,
  productCategoryOptions,
} from "../../../constant/product";

const Multiselect = dynamic(
  () =>
    import("multiselect-react-dropdown").then((module) => module.Multiselect),
  {
    ssr: false,
  }
);

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
      paddingRight: 4,
      width: "100%",
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
    },

    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },

    "& .multiSelectContainer": {
      marginTop: 8,
      paddingRight: 4,
    },
  },
  formControl: {
    marginTop: theme.spacing(1),
    paddingRight: 4,
    width: "100%",
  },
}));

function ProductEditPage({ post }) {
  const productData = JSON.parse(post);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [isProcessing, setProcessingTo] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [usage, setUsage] = useState("");
  const [message, setMessage] = useState();
  const [subCat, setSubCat] = useState(productData.subCategories);
  const classes = useStyles();
  console.log(productData);

  const data = {
    gst: productData.gst,
    stock: productData.inStock ? "Yes" : "No",
    usage: productData.usage,
    category: productData.category,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
    setValue("product_name", productData.name);
    setValue("product_desc", productData.description);
    setValue("size", productData.size);
    setValue("weight", productData.weight);
    setValue("mrp", productData.price);
    setValue("selling_price", productData.sellingPrice);
    setValue("minimum_qnty", productData.minimumQuantity);
  }, []);

  const subCatSelectedValues = ["Yoga"];

  const onCatSelect = (event) => {
    setSubCat(event);
  };

  const onCatRemove = (event) => {
    setSubCat(event);
  };

  const onSubmit = async (data) => {
    setProcessingTo(true);

    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i += 1) {
      formData.append("images", selectedImage[i]);
    }
    formData.append("product_name", data.product_name);
    formData.append("description", data.product_desc);
    formData.append("mrp", data.mrp);
    formData.append("selling_price", data.selling_price);
    formData.append(
      "discount",
      ((data.mrp - data.selling_price) / data.mrp) * 100
    );
    formData.append("gst", data.gst);
    formData.append("size", data.size);
    formData.append("weight", data.weight);
    formData.append("minimum_quantity", data.minimum_qnty);
    formData.append("category", data.category);
    formData.append(
      "sub_category",
      subCat.length === 0
        ? JSON.stringify(subCatSelectedValues)
        : JSON.stringify(subCat)
    );
    formData.append("stock", data.stock === "No" ? false : true);
    formData.append("usage", usage);
    formData.append(
      "slug",
      slugify(data.product_name, {
        remove: /[*+~.()'"!:@,]/g,
        lower: true,
      })
    );

    try {
      const result = await fetch(
        `https://gulshan-api.herokuapp.com/api/product/${productData.id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const resultJson = await result.json();

      if (resultJson.msg === "success") {
        setProcessingTo(false);
        setMessage("Product updated successfully");
      }
    } catch (error) {
      console.log(error);
      setProcessingTo(false);
      setMessage(error);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Dropzone
            onDrop={(acceptedFiles) => setSelectedImage(acceptedFiles)}
            maxFiles={5}
          >
            {({ getRootProps, getInputProps }) => (
              <section className="product-photo">
                <div {...getRootProps()}>
                  <input {...getInputProps()} multiple />
                  <p>
                    Drag 'n' drop Product Photos here, or click to select Photos{" "}
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Controller
            name="product_name"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Product Name"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
            rules={{ required: "Product Name is required" }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Controller
            name="product_desc"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Product Description"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
            rules={{ required: "Product Description is required" }}
          />
        </GridItem>

        <GridItem xs={6} sm={4} md={4}>
          <Controller
            name="mrp"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Maximum Retail Price"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
            rules={{
              required: "MRP is required",
              pattern: {
                value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                message: "Accept only decimal numbers",
              },
            }}
          />
        </GridItem>
        <GridItem xs={6} sm={4} md={4}>
          <Controller
            name="selling_price"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Your Selling Price"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
            rules={{
              required: "Selling Price is required",
              pattern: {
                value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                message: "Accept only decimal numbers",
              },
            }}
          />
        </GridItem>

        <GridItem xs={6} sm={4} md={4}>
          <div className={classes.select}>
            <Controller
              name="gst"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="gst_rate">GST Rate</InputLabel>
                  <Select
                    native
                    defaultValue={data.gst}
                    onChange={onChange}
                    label="GST Rate"
                    inputProps={{
                      name: "age",
                      id: "gst_rate",
                    }}
                  >
                    <option value="3">3 %</option>
                    <option value="5">5 %</option>
                    <option value="12">12 %</option>
                    <option value="18">18 %</option>
                    <option value="28">28 %</option>
                    <option value="0">Exempted</option>
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </GridItem>

        <GridItem xs={6} sm={4} md={4}>
          <Controller
            name="minimum_qnty"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Minimum Quantity"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
            rules={{
              required: "Minimum Quantity is required !",
              pattern: {
                value: /^([1-9]\d{0,5})*$/,
                message: "Accept number greater than 0",
              },
            }}
          />
        </GridItem>

        <GridItem xs={6} sm={4} md={4}>
          <Controller
            name="weight"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Weight (Grams)"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
            rules={{
              pattern: {
                value: /^([\d]{0,6})(\.[\d]{1,2})?$/,
                message: "Accept only decimal numbers",
              },
            }}
          />
        </GridItem>

        <GridItem xs={6} sm={4} md={4}>
          <Controller
            name="size"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Product Size (LxBXH)"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </GridItem>

        <GridItem xs={6} sm={4} md={4}>
          <div className={classes.select}>
            <Controller
              name="category"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="category">Product Category</InputLabel>
                  <Select
                    native
                    defaultValue={data.category}
                    onChange={onChange}
                    label="Product Category"
                    inputProps={{
                      name: "category",
                      id: "category",
                    }}
                  >
                    {productCategoryOptions.map((item, i) => (
                      <option key={i} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </GridItem>
        <GridItem xs={6} sm={4} md={4}>
          <Multiselect
            options={productSubCategoryOptions}
            selectedValues={productData.subCategories}
            onSelect={onCatSelect}
            onRemove={onCatRemove}
            placeholder="+ Add Sub Category"
            id="catOption"
            isObject={false}
            className="catDrowpdown"
          />
        </GridItem>

        <GridItem xs={6} sm={4} md={4}>
          <div className={classes.select}>
            <Controller
              name="stock"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="stock">Stock Available</InputLabel>
                  <Select
                    native
                    defaultValue={data.stock}
                    onChange={onChange}
                    label="Stock Available"
                    inputProps={{
                      name: "stock",
                      id: "stock",
                    }}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          {editorLoaded ? (
            <CKEditor
              editor={ClassicEditor}
              data={data.usage}
              onReady={(editor) => {
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "160px",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setUsage(data);
              }}
            />
          ) : (
            <p>editor..</p>
          )}
        </GridItem>
        <GridItem xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
          <div>
            <Button type="submit" variant="contained" color="primary">
              {isProcessing ? "Updating..." : `Update`}
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    </form>
  );
}

ProductEditPage.layout = Admin;

export default ProductEditPage;

export async function getServerSideProps({ params, req, res }) {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { post: JSON.stringify([]) } };
  }
  try {
    const { id } = params;
    const post = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    return {
      props: { post: JSON.stringify(post) },
    };
  } catch {
    res.statusCode = 404;
    return {
      props: {},
    };
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
