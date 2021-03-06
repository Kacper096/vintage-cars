import { Box, CircularProgress } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Paged from "../../../core/models/paged/Paged";
import useInfinitePagedListAPI from "../../../hooks/fetch/pagedAPI/InfinitePagedAPIHook";
import MediaCard from "../../base/cards/media-card/MediaCardComponent";
import ProductAnnouncementShortInfoView from "../models/ProductAnnouncementShortInfoView";
import ProductAnnouncementDetails from "../product-announcement-details/ProductAnnouncemetDetails";
import useStyles from "./product-announcement-list-style";

interface ProductAnnouncementProps {
    pageSize: number,
}

const ProductAnnouncementList = (props: ProductAnnouncementProps) => {
    const classes = useStyles();
    const { pageSize } = props;
    const [fetchProductAnnouncements, isLoadingProductAnnouncements, productAnnouncements] = useInfinitePagedListAPI<ProductAnnouncementShortInfoView>("/v1/productannouncement/list");
    const [page, setPage] = useState(0);
    const detailRef = useRef(null);
    
    const fetchMore = () => {
        setPage(prevState => prevState + 1)
    }
    const handleOpenDetails = (id) => {
        detailRef.current.openForm(id)
    }
    useEffect(() => {
        fetchProductAnnouncements(new Paged(page, pageSize));
    }, []);

    useEffect(() => {
        fetchProductAnnouncements(new Paged(page, pageSize));
    }, [page])

    return (
        <Box className={classes.root} key="flexbox-container">
            <InfiniteScroll
                className={classes.infiniteScroll}
                key="infinite-scroll"
                dataLength={pageSize}
                next={fetchMore}
                hasMore={productAnnouncements?.source?.length < productAnnouncements?.totalCount}
                loader={<CircularProgress style={{display: 'flex', position: 'relative'}}/>}
            >
                {productAnnouncements?.source?.map((product, index) => {
                    return (
                        <MediaCard
                            key={`${product?.name}-${index}`}
                            title={product?.name}
                            description={product?.shortDescription}
                            imageMimeType={product?.mainPicture?.mimeType}
                            imageData={product?.mainPicture?.dataAsBase64}
                            onClick={() => handleOpenDetails(product.id)}
                        />
                    )
                })}
            </InfiniteScroll>
            <ProductAnnouncementDetails ref={detailRef}/>
        </Box>

    )
}

export default ProductAnnouncementList;