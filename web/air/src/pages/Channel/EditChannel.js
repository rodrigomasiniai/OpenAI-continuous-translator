import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {API, isMobile, showError, showInfo, showSuccess, verifyJSON} from '../../helpers';
import {CHANNEL_OPTIONS} from '../../constants';
import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import {SideSheet, Space, Spin, Button, Input, Typography, Select, TextArea, Checkbox, Banner} from "@douyinfe/semi-ui";

const MODEL_MAPPING_EXAMPLE = {
    'gpt-3.5-turbo-0301': 'gpt-3.5-turbo',
    'gpt-4-0314': 'gpt-4',
    'gpt-4-32k-0314': 'gpt-4-32k'
};

function type2secretPrompt(type) {
    // inputs.type === 15 ? 'Enter in the following format: APIKey|SecretKey' : (inputs.type === 18 ? 'Enter in the following format: APPID|APISecret|APIKey' : 'Please enter the authentication key corresponding to the channel')
    switch (type) {
        case 15:
            return 'Enter in the following format: APIKey|SecretKey';
        case 18:
            return 'Enter in the following format: APPID|APISecret|APIKey';
        case 22:
            return 'Enter in the following format: APIKey-AppId, for example: fastgpt-0sp2gtvfdgyi4k30jwlgwf1i-64f335d84283f05518e9e041';
        case 23:
            return 'Enter in the following format: AppId|SecretId|SecretKey';
        default:
            return 'Please enter the authentication key corresponding to the channel';
    }
}

const EditChannel = (props) => {
    const navigate = useNavigate();
    const channelId = props.editingChannel.id;
    const isEdit = channelId !== undefined;
    const [loading, setLoading] = useState(isEdit);
    const handleCancel = () => {
        props.handleClose()
    };
    const originInputs = {
        name: '',
        type: 1,
        key: '',
        openai_organization: '',
        base_url: '',
        other: '',
        model_mapping: '',
        models: [],
        auto_ban: 1,
        groups: ['default']
    };
    const [batch, setBatch] = useState(false);
    const [autoBan, setAutoBan] = useState(true);
    // const [autoBan, setAutoBan] = useState(true);
    const [inputs, setInputs] = useState(originInputs);
    const [originModelOptions, setOriginModelOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([]);const [groupOptions, setGroupOptions] = useState([]);
const [basicModels, setBasicModels] = useState([]);
const [fullModels, setFullModels] = useState([]);
const [customModel, setCustomModel] = useState('');
const handleInputChange = (name, value) => {
    setInputs((inputs) => ({...inputs, [name]: value}));
    if (name === 'type' && inputs.models.length === 0) {
        let localModels = [];
        switch (value) {
            case 14:
                localModels = ["claude-instant-1.2", "claude-2", "claude-2.0", "claude-2.1", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"];
                break;
            case 11:
                localModels = ['PaLM-2'];
                break;
            case 15:
                localModels = ['ERNIE-Bot', 'ERNIE-Bot-turbo', 'ERNIE-Bot-4', 'Embedding-V1'];
                break;
            case 17:
                localModels = ["qwen-turbo", "qwen-plus", "qwen-max", "qwen-max-longcontext", 'text-embedding-v1'];
                break;
            case 16:
                localModels = ['chatglm_pro', 'chatglm_std', 'chatglm_lite'];
                break;
            case 18:
                localModels = ['SparkDesk', 'SparkDesk-v1.1', 'SparkDesk-v2.1', 'SparkDesk-v3.1', 'SparkDesk-v3.5'];
                break;
            case 19:
                localModels = ['360GPT_S2_V9', 'embedding-bert-512-v1', 'embedding_s1_v1', 'semantic_similarity_s1_v1'];
                break;
            case 23:
                localModels = ['hunyuan'];
                break;
            case 24:
                localModels = ['gemini-pro', 'gemini-pro-vision'];
                break;
            case 25:
                localModels = ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'];
                break;
            case 26:Instructions: 
        "localModels = ['glm-4', 'glm-4v', 'glm-3-turbo'];
            break;
        case 2:
            localModels = ['mj_imagine', 'mj_variation', 'mj_reroll', 'mj_blend', 'mj_upscale', 'mj_describe'];
            break;
        case 5:
            localModels = [
                'swap_face',
                'mj_imagine',
                'mj_variation',
                'mj_reroll',
                'mj_blend',
                'mj_upscale',
                'mj_describe',
                'mj_zoom',
                'mj_shorten',
                'mj_modal',
                'mj_inpaint',
                'mj_custom_zoom',
                'mj_high_variation',
                'mj_low_variation',
                'mj_pan',
            ];
            break;
        }
        setInputs((inputs) => ({...inputs, models: localModels}));
    }
    //setAutoBan
};


const loadChannel = async () => {
    setLoading(true)
    let res = await API.get(`/api/channel/${channelId}`);
    const {success, message, data} = res.data;
    if (success) {
        if (data.models === '') {
            data.models = [];
        } else {
            data.models = data.models.split(',');
        }
        if (data.group === '') {
            data.groups = [];
        } else {
            data.groups = data.group.split(',');
        }
        if (data.model_mapping !== '') {
            data.model_mapping = JSON.stringify(JSON.parse(data.model_mapping), null, 2);
        }
        setInputs(data);
        if (data.auto_ban === 0) {
            setAutoBan(false);
        } else {
            setAutoBan(true);
        }
        // console.log(data);
    } else {
        showError(message);
    }
    setLoading(false);".};

    const fetchModels = async () => {
        try {
            let res = await API.get(`/api/channel/models`);
            let localModelOptions = res.data.data.map((model) => ({
                label: model.id,
                value: model.id
            }));
            setOriginModelOptions(localModelOptions);
            setFullModels(res.data.data.map((model) => model.id));
            setBasicModels(res.data.data.filter((model) => {
                return model.id.startsWith('gpt-3') || model.id.startsWith('text-');
            }).map((model) => model.id));
        } catch (error) {
            showError(error.message);
        }
    };

    const fetchGroups = async () => {
        try {
            let res = await API.get(`/api/group/`);
            setGroupOptions(res.data.data.map((group) => ({
                label: group,
                value: group
            })));
        } catch (error) {
            showError(error.message);
        }
    };

    useEffect(() => {
        let localModelOptions = [...originModelOptions];
        inputs.models.forEach((model) => {
            if (!localModelOptions.find((option) => option.key === model)) {
                localModelOptions.push({
                    label: model,
                    value: model
                });
            }
        });
        setModelOptions(localModelOptions);
    }, [originModelOptions, inputs.models]);

    useEffect(() => {
        fetchModels().then();
        fetchGroups().then();
        if (isEdit) {
            loadChannel().then(
                () => {

                }
            );
        } else {
            setInputs(originInputs)
        }
    }, [props.editingChannel.id]);


    const submit = async () => {
        if (!isEdit && (inputs.name === '' || inputs.key === '')) {
            showInfo('Please fill in the channel name and channel key!');
            return;
        }
        if (inputs.models.length === 0) {
            showInfo('Please select at least one model!');
            return;
        }The model mapping must be in valid JSON format!
Channel update successful!
Channel creation successful!
The model already exists!Return [...modelOptions, ...localModelOptions];
        });
        setCustomModel('');
        handleInputChange('models', localModels);
    };

    return (
        <>
            <SideSheet
                maskClosable={false}
                placement={isEdit ? 'right' : 'left'}
                title={<Title level={3}>{isEdit ? 'Update Channel Information' : 'Create a New Channel'}</Title>}
                headerStyle={{borderBottom: '1px solid var(--semi-color-border)'}}
                bodyStyle={{borderBottom: '1px solid var(--semi-color-border)'}}
                visible={props.visible}
                footer={
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Space>
                            <Button theme='solid' size={'large'} onClick={submit}>Submit</Button>
                            <Button theme='solid' size={'large'} type={'tertiary'} onClick={handleCancel}>Cancel</Button>
                        </Space>
                    </div>
                }
                closeIcon={null}
                onCancel={() => handleCancel()}
                width={isMobile() ? '100%' : 600}
            >
                <Spin spinning={loading}>
                    <div style={{marginTop: 10}}>
                        <Typography.Text strong>Type:</Typography.Text>
                    </div>
                    <Select
                        name='type'
                        required
                        optionList={CHANNEL_OPTIONS}
                        value={inputs.type}
                        onChange={value => handleInputChange('type', value)}
                        style={{width: '50%'}}
                    />
                    {
                        inputs.type === 3 && (
                            <>
                                <div style={{marginTop: 10}}>
                                    <Banner type={"warning"} description={Note that <strong>the model deployment name must match the model name</strong>, because One API will replace the 'model' parameter in the request body with your deployment name (dots in the model name will be removed), <a target='_blank' href='https://github.com/songquanpeng/one-api/issues/133?notification_referrer_id=NT_kwDOAmJSYrM2NjIwMzI3NDgyOjM5OTk4MDUw#issuecomment-1571602271'>demonstrated in the image</a>.Instructions: Translate the following Chinese text to English 
while maintaining the original formatting: "handleInputChange('other', value)
                                    }}
                                    value={inputs.other}
                                    autoComplete='new-password'
                                />
                            </>
                        )
                    }
                    {
                        inputs.type === 8 && (
                            <>
                                <div style={{marginTop: 10}}>
                                    <Typography.Text strong>Base URL:</Typography.Text>
                                </div>
                                <Input
                                    name='base_url'
                                    placeholder={'Please enter the Base URL for the custom channel'}
                                    onChange={value => {
                                        handleInputChange('base_url', value)
                                    }}
                                    value={inputs.base_url}
                                    autoComplete='new-password'
                                />
                            </>
                        )
                    }
                    <div style={{marginTop: 10}}>
                        <Typography.Text strong>Name:</Typography.Text>
                    </div>
                    <Input
                        required
                        name='name'
                        placeholder={'Please name the channel'}
                        onChange={value => {
                            handleInputChange('name', value)
                        }}
                        value={inputs.name}
                        autoComplete='new-password'
                    />
                    <div style={{marginTop: 10}}>
                        <Typography.Text strong>Group:</Typography.Text>
                    </div>
                    <Select
                        placeholder={'Please select the group that can use this channel'}
                        name='groups'"required
                        multiple
                        selection
                        allowAdditions
                        additionLabel={'Please edit the group rate in the system settings page to add a new group:'}
                        onChange={value => {
                            handleInputChange('groups', value)
                        }}
                        value={inputs.groups}
                        autoComplete='new-password'
                        optionList={groupOptions}
                    />
                    {
                        inputs.type === 18 && (
                            <>
                                <div style={{marginTop: 10}}>
                                    <Typography.Text strong>Model Version:</Typography.Text>
                                </div>
                                <Input
                                    name='other'
                                    placeholder={'Please enter the version of the Spark Big Model, note it is the version number in the interface address, for example: v2.1'}
                                    onChange={value => {
                                        handleInputChange('other', value)
                                    }}
                                    value={inputs.other}
                                    autoComplete='new-password'
                                />
                            </>
                        )
                    }
                    {
                        inputs.type === 21 && (
                            <>
                                <div style={{marginTop: 10}}>
                                    <Typography.Text strong>Knowledge Base ID:</Typography.Text>
                                </div>
                                <Input
                                    label='Knowledge Base ID'
                                    name='other'
                                    placeholder={'Please enter the Knowledge Base ID, for example: 123456'}
                                    onChange={value => {
                                        handleInputChange('other', value)
                                    }}"Instructions: Translate the following Chinese text to English 
while maintaining the original formatting: "value={inputs.other}
                                    autoComplete='new-password'
                                />
                            </>
                        )
                    }
                    <div style={{marginTop: 10}}>
                        <Typography.Text strong>Model:</Typography.Text>
                    </div>
                    <Select
                        placeholder={'Please select the models supported by this channel'}
                        name='models'
                        required
                        multiple
                        selection
                        onChange={value => {
                            handleInputChange('models', value)
                        }}
                        value={inputs.models}
                        autoComplete='new-password'
                        optionList={modelOptions}
                    />
                    <div style={{lineHeight: '40px', marginBottom: '12px'}}>
                        <Space>
                            <Button type='primary' onClick={() => {
                                handleInputChange('models', basicModels);
                            }}>Fill in basic models</Button>
                            <Button type='secondary' onClick={() => {
                                handleInputChange('models', fullModels);
                            }}>Fill in all models</Button>
                            <Button type='warning' onClick={() => {
                                handleInputChange('models', []);
                            }}>Clear all models</Button>
                        </Space>
                        <Input
                            addonAfter={
                                <Button type='primary' onClick={addCustomModel}>Fill in</Button>
                            }
                            placeholder='Enter custom model name'
                            value={customModel}
                            onChange={(value) => {
                                setCustomModel(value.trim());
                            }}"Instructions: Translate the following Chinese text to English 
while maintaining the original formatting: "/>
                    </div>
                    <div style={{marginTop: 10}}>
                        <Typography.Text strong>Model Redirect:</Typography.Text>
                    </div>
                    <TextArea
                        placeholder={`This is optional, used to modify the model names in the request body, as a JSON string, with keys as the model names in the request and values as the model names to be replaced, for example:\n${JSON.stringify(MODEL_MAPPING_EXAMPLE, null, 2)}`}
                        name='model_mapping'
                        onChange={value => {
                            handleInputChange('model_mapping', value)
                        }}
                        autosize
                        value={inputs.model_mapping}
                        autoComplete='new-password'
                    />
                    <Typography.Text style={{
                        color: 'rgba(var(--semi-blue-5), 1)',
                        userSelect: 'none',
                        cursor: 'pointer'
                    }} onClick={
                        () => {
                            handleInputChange('model_mapping', JSON.stringify(MODEL_MAPPING_EXAMPLE, null, 2))
                        }
                    }>
                        Fill in Template
                    </Typography.Text>
                    <div style={{marginTop: 10}}>
                        <Typography.Text strong>Key:</Typography.Text>
                    </div>
                    {
                        batch ?
                            <TextArea
                                label='Key'
                                name='key'
                                required
                                placeholder={'Please enter the keys, one per line'}
                                onChange={value => {
                                    handleInputChange('key', value)
                                }}
                                value={inputs.key}
                                style={{minHeight: 150, fontFamily: 'JetBrains Mono, Consolas'}}
                                autoComplete='new-password'
                            />".```
                    <Input
                        label='Key'
                        name='key'
                        required
                        placeholder={type2secretPrompt(inputs.type)}
                        onChange={value => {
                            handleInputChange('key', value)
                        }}
                        value={inputs.key}
                        autoComplete='new-password'
                    />
                    }
                    <div style={{marginTop: 10}}>
                        <Typography.Text strong>Organization:</Typography.Text>
                    </div>
                    <Input
                        label='Organization, optional, default organization if left blank'
                        name='openai_organization'
                        placeholder='Enter organization org-xxx'
                        onChange={value => {
                            handleInputChange('openai_organization', value)
                        }}
                        value={inputs.openai_organization}
                    />
                    <div style={{marginTop: 10, display: 'flex'}}>
                        <Space>
                            <Checkbox
                                name='auto_ban'
                                checked={autoBan}
                                onChange={
                                    () => {
                                        setAutoBan(!autoBan);
                                    }
                                }
                                // onChange={handleInputChange}
                            />
                            <Typography.Text
                                strong>Auto Disable (only effective when auto disable is enabled), will not auto disable this channel after closing:</Typography.Text>
                        </Space>
                    </div>

                    {
                        !isEdit && (
                            <div style={{marginTop: 10, display: 'flex'}}
``````
<Space>
    <Checkbox
        checked={batch}
        label='Batch Create'
        name='batch'
        onChange={() => setBatch(!batch)}
    />
    <Typography.Text strong>Batch Create</Typography.Text>
</Space>
</div>
{
    inputs.type !== 3 && inputs.type !== 8 && inputs.type !== 22 && (
        <>
            <div style={{marginTop: 10}}>
                <Typography.Text strong>Proxy:</Typography.Text>
            </div>
            <Input
                label='Proxy'
                name='base_url'
                placeholder={'Optional, used to make API calls through a proxy site'}
                onChange={value => {
                    handleInputChange('base_url', value)
                }}
                value={inputs.base_url}
                autoComplete='new-password'
            />
        </>
    )
}
{
    inputs.type === 22 && (
        <>
            <div style={{marginTop: 10}}>
                <Typography.Text strong>Private Deployment Address:</Typography.Text>
            </div>
            <Input
                name='base_url'
                placeholder={'Please enter the private deployment address, format: https://fastgpt.run/api/openapi'}
```onChange={value => {
                                        handleInputChange('base_url', value)
                                    }}
                                    value={inputs.base_url}
                                    autoComplete='new-password'
                                />
                            </>
                        )
                    }

                </Spin>
            </SideSheet>
        </>
    );
};

export default EditChannel;