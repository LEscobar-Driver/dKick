import React, {Component} from 'react';
import { factoryInstance, web3Errors } from '../ethereum/factory.js';
import Campaign from '../ethereum/campaign.js';
import { Card, Button, Popup, Image } from 'semantic-ui-react';
import Layout from '../components/Layout.js';
import { Link } from '../routes';
import { getConnection } from '../ethereum/web3.js';
import SignatureError from '../components/SignatureError.js';


class CampaignIndex extends Component {
    state = {
        web3Errors : web3Errors
    };

    static async getInitialProps() {

        const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();
        const campaign_names = [];
        const campaign_descriptions = [];
        // const j = campaigns.length;

        let single_campaign;
        let name;
        let description;

        for( let i = 0; i < campaigns.length; i++) {
            single_campaign = await Campaign(campaigns[i]);
            name = await single_campaign.methods.campaignName().call();
            description = await single_campaign.methods.campaignDescription().call();

            campaign_names.push(name);
            campaign_descriptions.push(description);
            // console.log(`Name at index ${i} is ${name}`);
        }

        console.log("PAGES/LANDING web3Errors:", web3Errors);

        return { campaigns: campaigns, campaign_names: campaign_names, campaign_descriptions: campaign_descriptions };
    }

    renderCampaigns = () => {
        // const items = new Array();
        // console.log('this.props.campaigns.length:', this.props.campaigns.length);

        // let name;
        // (async() => {
        //     let single_campaign = await Campaign(address);
        //     name = await single_campaign.methods.campaignName().call();
        //     console.log("\n\nNAME INSUDE:", name);
        // })();
        // console.log("\n\nNAME OUTSIDE:", name);

        // let single_campaign = Campaign(address);
        // let name = single_campaign.methods.campaignName().call().then( (name) => {
        //     console.log('name in function: ', name)
        //     return name;
        // });
        // console.log("\n\nNAME:", name);

        // console.log("\ncampaigns ___ 666:", this.props.campaigns);
        // console.log("\ncampaign_names ___ 666:", this.props.campaign_names);

        // pass a function into map() that exectures once per element in the array
        const items = this.props.campaigns.map( (address, index) => {

            // console.log("\n\nindex:", index);

            return {
                header: this.props.campaign_names[index],
                meta: address,
                description: 
                (
                    <div>
                        <p align="center" style={{ marginTop: 10, fontSize: 15 }}>{this.props.campaign_descriptions[index]}</p>
                        <Link route={`/campaigns/${address}`}>                    
                            <a>View Campaign</a>
                        </Link>  
                    </div> 
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return(
            <Layout {...this.state.web3Errors}>
                <SignatureError {...this.state.web3Errors.missingMetaMask}/>
                {/* <div style={{ visibility: !this.state.web3Errors.missingMetaMask ? 'visible': 'hidden'}}>test {this.state.web3Errors.missingMetaMask.toString()}
                    {!this.state.web3Errors.missingMetaMask ? null : (
                        <div>
                            <h3 align="center">Metamask required! Website may not function as intended.</h3>
                            <Popup
                                // on="click"
                                // open={"false"}
                                hidden={!this.state.web3Errors.missingMetaMask}
                                header="Metamask"
                                size="small" 
                                content="Metamask is required to access the Ethereum network." 
                                trigger={
                                    <div>
                                        <Link >
                                            <a href={"https://metamask.io/"} target="_blank">
                                                <Button fluid negative content="Get metamask">
                                                    <Image avatar src="../static/metamask.png"></Image>
                                                    Get Metamask extension
                                                </Button>
                                            </a>
                                        </Link>
                                    </div>
                                } 
                            >
                            </Popup>
                        </div>
                    )}
                </div> */}

                {/* <div>
                    {!this.state.web3Errors.signatureError ? null : (
                        <div>
                            <h3 align="center">Metamask connection required!</h3>
                            <Popup
                                header="Metamask Connection"
                                size="small" 
                                content="Metamask connection needed. " 
                                isOpen="false"
                                trigger={
                                    <div>
                                        <Button onClick={getConnection} fluid negative content="Metamask connection" >
                                            <Image avatar src="../static/metamask.png"></Image>
                                            Request Metamask connection
                                        </Button>
                                    </div>
                                } 
                            >
                            </Popup>
                        </div>
                    )} 
                </div>
                <div style={{ marginTop: '50px' }}></div> */}

                <div>
                    {/* <h2>Web3 missingMetaMask --> {this.state.web3Errors.missingMetaMask.toString()}</h2>
                    <h2>Web3 signatureError --> {this.state.web3Errors.signatureError.toString()}</h2> */}
                    <h3>Open Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button 
                                floated='right'
                                content="Create Campaign"
                                icon="add circle"
                                primary={true}
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;