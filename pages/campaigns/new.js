import React, {Component} from 'react';
import Layout from '../../components/Layout.js'
import { Form, Button, Input, Message, TextArea } from 'semantic-ui-react';
import factory from '../../ethereum/factory.js'; 
import web3 from '../../ethereum/web3.js';
import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: "",
        errorMessage: "",
        hidden: true,
        loading: false,
        name: "",
        description: "",
        nameError: false,
        miniContributionError: false,
        descriptionError: false
    };

    handleDIsmiss = () => {
        this.setState({ hidden: false });

        setTimeout( () => {
            this.setState({ errorMessage: "", hidden: true })
        }, 90);
    };

    handleDescription = () => {
        if (this.state.description.length > 1 && this.state.description !== '') {
            return false;
        }
        let errMsg = this.state.errorMessage + " Invalid Description value.";
        this.setState({ errorMessage: errMsg});
        return true;
    };

    handleContribution = () => {
        if (this.state.minimumContribution !== '0' && this.state.minimumContribution !== '') {
            return false;
        }
        let errMsg = this.state.errorMessage + " Invalid Minimum Contribution value.";
        this.setState({ errorMessage: errMsg});
        return true;
    };

    handleName = () => {
        if (this.state.name.length > 1 && this.state.name !== '') {
            return false;
        }
        let errMsg = this.state.errorMessage + " Invalid Name value.";
        this.setState({ errorMessage: errMsg});
        return true;
    };

    onSubmit = async (event) => {
        event.preventDefault();

        await this.setState({ errorMessage: "", 
                              loading: true,
                              miniContributionError: false,
                              nameError: false,
                              descriptionError: false
        });

        await this.setState({ nameError: this.handleName(),
                              descriptionError: this.handleDescription(),
                              miniContributionError: this.handleContribution()   
        });

        // console.log('\n\nminimumContribution is:', this.state.minimumContribution, '\n\n');
        // console.log('\n\nname is:', this.state.name, '\n\n');
        // console.log('\n\ndescription is:', this.state.description, '\n\n');
        console.log('\ndescriptionError is:', this.state.descriptionError, '');
        console.log('\nnameError is:', this.state.nameError, '');
        console.log('\nminiContributionError is:', this.state.miniContributionError, '');
        console.log('\nerrorMessage is:', this.state.errorMessage, '');
        // console.log(typeof this.state.minimumContribution);

        if (this.state.errorMessage === "") {

            try {
                const accounts = await web3.eth.getAccounts();
                await factory.methods.createCampaign(this.state.minimumContribution, this.state.name, this.state.description)
                        .send({ from: accounts[0] });
                Router.pushRoute('/');
            } catch (err) { 
                this.setState({ errorMessage: err.message, hidden: false });
            }

        } else {
            // this.setState({ errorMessage: 'Invalid minimum contribution', hidden: false });
        }

        this.setState({ loading: false });
    };

    render() {
        return(
            <Layout>

                <h3>Create a Campaign!</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>

                    <Form.Field>
                        <label>Name</label>
                        <Input 
                            value={this.state.name}
                            onChange={ (event) => {
                                this.setState({ name: event.target.value });
                            }}>
                        </Input>
                    </Form.Field>

                    <Form.Field error={!!this.state.errorMessage}>
                        <label>Minimum Contribution</label>
                        <Input 
                            label="wei" 
                            labelPosition="right" 
                            value={this.state.minimumContribution}
                            onChange={ (event) => {
                                this.setState({ minimumContribution: event.target.value });
                            }}>
                        </Input>
                    </Form.Field>

                    <Form.TextArea
                        autoHeight
                        rows={3}
                        label="Description"
                        placeholder="Tell us more about your campaign"
                        value={this.state.description}
                        onChange={ (event) => {
                            this.setState({ description: event.target.value });
                        }}
                    />

                    <Message error hidden={this.state.hidden} header="Opps!" content={this.state.errorMessage} onDismiss={this.handleDIsmiss}></Message>
                    <Button loading={this.state.loading} primary={true}>Create!</Button>
                </Form>

            </Layout>
        );
    }
}

export default CampaignNew;