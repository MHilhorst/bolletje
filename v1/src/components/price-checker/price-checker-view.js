import React from "react";
import { Box } from "../../styles/style";
import { Button, Table } from "antd";
import OfferItem from "./offer-item";
const columns = [
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName"
  },
  {
    title: "EAN",
    dataIndex: "ean",
    key: "ean"
  },
  {
    title: "Current Price",
    dataIndex: "currentPrice",
    key: "currentPrice"
  },
  {
    title: "Current Stock",
    dataIndex: "currentStock",
    key: "currentStock"
  },
  {
    title: "Total sellers",
    dataIndex: "totalSellers",
    key: "totalSellers"
  },
  {
    title: "Profit",
    dataIndex: "profit",
    key: "profit"
  },
  {
    title: "Offer Rank",
    dataIndex: "offerRank",
    key: "offerRank"
  },
  {
    title: "Configure",
    key: "configure",
    render: () => (
      <span>
        <a>Invite</a>
        <a>Delete</a>
      </span>
    )
  }
];
export default class PriceCheckerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <Box>
          <Button type="secondary" onClick={this.props.handleReloadOffers}>
            Reload your offers
          </Button>
        </Box>
        <Box>
          {/* {this.props.offers.map(offer => {
            return <OfferItem offer={offer} />;
          })} */}
          <Table dataSource={this.props.tableOffers} columns={columns} />;
        </Box>
      </>
    );
  }
}
