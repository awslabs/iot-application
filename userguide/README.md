# IoT Application User Guide (Editor's note to writer... Remove all editor notes before publishing: Feature names are generally lowercase, as opposed to service names, which use title case. As a feature, you'd need to change this to "IoT application" everywhere unless you request "Application" in this SIM and it's accepted: https://sim.amazon.com/issues/create?template=600779ba-fa76-44ba-92cc-5415cea9ba72)

## Introduction

IoT Application helps businesses and application users keep track of their IoT devices and data. By creating and managing custom dashboards, you can monitor your IoT devices and their data in real-time and connect to your AWS IoT SiteWise data. (Editor's note to the writer:  Hi, other than some grammar, I removed the vague promise "easy-to-use tool designed to." Instead of words like easy, you should state what makes it easy, such as if it has an "intuitive interface.")

## Prerequisites

If you don't have the IoT Application feature, contact your AWS administrator. For information about how to create a portal, see Getting started in the repository's [README.md](../README.md). (Editor's note: We don't put "an" in front of service and feature names, only in front of the resources that these create. I rewrote this as though it's the feature you're talking about, but be mindful of two naming rules: 1) Whatever the naming manager to use for your feature name (lowercase vs capital A) you need must adhere to that name everywhere.2) When referring to a resource that a feature creates, if it is the same word you phrase it like this: "don't have the application that <featurename> creates")

## User Creation

NOTE: To prevent unwanted signups, that option is disabled.

An AWS administrator can create application users by following these steps:

1.[NOTE to the writer: The first step must state the console and link to it. Such as: Sign in to the AWS Management Console and open the <Embed link in the words "Amazon Cognito console">. Note that console is lowercase when referring to the all consoles except when you say the AWS Management Console.)
2. Find the IoT Application **UserPool** by searching `UserPool` on the CloudFormation stack for IoT Application.
    ![user-pool-resource-on-cfn](./imgs/user-pool-resource-on-cfn.png)
1. Choose the **Physical ID** link. This displays the **UserPool** on the **Amazon Cognito** console.
    ![users-tab-on-cognito](./imgs/users-tab-on-cognito.png)
1. To create a new user: On the **UserPool** page, in the **Users** tab, choose **Create user**.

## User Login
1. Obtain your user **name** and **password** and the IoT Application URL from your AWS administrator.
1. On your browser, enter the IoT Application URL. (Editor's note - provide that URL for them to copy and paste)
    ![app-sign-in-screen](./imgs/app-sign-in-screen.png)
1. Input your user **name** and **password** and click the **Sign in** button.
1. You should be routed to the IoT Application home page. (Editor's note: change "you should be routed" to active voice of what actually happens and where it happens. Such as "The <featurename> console opens." ) 

## Create Dashboards
(editor's note: don't forget to provide the name of the console with an embedded hyperlink in the name in the first step.)
1. On the **dashboards** page, choose **Create dashboard**.
    ![dashboard-creation-screen](./imgs/dashboard-creation-screen.png)
1. To create your own dashboard, enter the dashboard information.
1. Choose **Create** to create the dashboard.
1. After the dashboard is created, you will be routed to the newly created dashboard. (Editor's note: Be specific. Instead of "you will be routed to," do you mean "the newly created dashboard opens in a new window"? Say it with active voice; what/who does what.) 
1. You can modify the dashboard with intuitive drag-and-drop support.

## List Dashboards
(Editor's note: same note about the link to the console or wherever this takes place.)
1. On the **dashboards** page, find the dashboards table.
    ![dashboards-list-screen.png](./imgs/dashboards-list-screen.png)
1. You can perform the following actions on the **dashboards** page:
    1. **Update dashboard information**
    1. **Delete dashboards** Removed (s), because to donote either plural or singular, we use plural.
    1. **Search dashboards**
    1. **Configure table preferences**
    1. **Configure table column sort** (is "sort" the word they see in the interface? If not, I'd change that to "type" because sort can be confused with the verb "to sort/arrange")

## View Dashboards

1. To view the dashboard: On the **dashboards** page, choose the dashboard name.
    ![dashboard-screen.png](./imgs/dashboard-screen.png)
1. You can toggle between **Preview** and **Edit** modes.


## Update Dashboards

1. On the **dashboards** page, under **Edit** mode, you can modify the dashboard.
    ![dashboard-edit-screen.png](./imgs/dashboard-edit-screen.png)
1. You can update your dashboard with different combinations of the following:
    1. **Asset properties**
    1. **Components**
    1. **Component configuration**
    1. **Time machine**
1. Choose **Save** to save your updates.

## Sign out

1. On any page, choose the user icon (name) to sign out. (Editor's note: we avoid slash to denote either/or. If it's another name for it we put that in parentheses, like I did.)
    ![app-sign-out-screen.png](./imgs/app-sign-out-screen.png)
1. After you sign out, you will be routed to the sign in page. (Editor's note: instead of passive "you will be routed," say what happens in active voice, such as "the sign-in page opens" in a new window or however it works. Also note how we use "sign-in" vs sign in https://alpha.www.docs.aws.a2z.com/awsstyleguide/latest/styleguide/dictionary.html#style-signin )
