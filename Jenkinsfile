pipeline {

    agent any

    tools {
      nodejs 'nodejs22'
    }  
  
    environment {
        AWS_REGION     = 'ap-south-1'
        ECR_REPOSITORY = 'jenkins-migration-demo'
        IMAGE_TAG      = "${BUILD_NUMBER}"
        APP_PORT       = '8081'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "Running application tests..."
                    npm install
                    npm test
                '''
            }
        }

        stage('Configure AWS') {
            steps {

                script {

                    env.AWS_ACCOUNT_ID = sh(
                        script: '''
                            aws sts get-caller-identity \
                                --query Account \
                                --output text
                        ''',
                        returnStdout: true
                    ).trim()

                    env.ECR_REGISTRY =
                        "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
                }

                sh '''
                    echo "AWS authentication successful"

                    aws sts get-caller-identity

                    echo "AWS Account: ${AWS_ACCOUNT_ID}"
                    echo "ECR Registry: ${ECR_REGISTRY}"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {

                sh '''
                    echo "Building Docker image..."

                    docker build \
                        -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

                    echo "Docker image built successfully"

                    docker images | grep ${ECR_REPOSITORY}
                '''
            }
        }

        stage('Login to ECR') {
            steps {

                sh '''
                    echo "Logging into Amazon ECR..."

                    aws ecr get-login-password \
                        --region ${AWS_REGION} |
                    docker login \
                        --username AWS \
                        --password-stdin \
                        ${ECR_REGISTRY}

                    echo "ECR login successful"
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {

                sh '''
                    echo "Tagging Docker image..."

                    docker tag \
                        ${ECR_REPOSITORY}:${IMAGE_TAG} \
                        ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}

                    echo "Pushing Docker image to ECR..."

                    docker push \
                        ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}

                    echo "Image pushed successfully"

                    echo "Image:"
                    echo "${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"
                '''
            }
        }

        stage('Deploy') {
            steps {

                sh '''
                    echo "Starting deployment..."

                    echo "Stopping old container..."
                    docker stop app || true

                    echo "Removing old container..."
                    docker rm app || true

                    echo "Pulling image from ECR..."

                    docker pull \
                        ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}

                    echo "Starting new container..."

                    docker run -d \
                        --name app \
                        -p ${APP_PORT}:8080 \
                        ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}

                    echo "Application deployed successfully"

                    echo "Running containers:"
                    docker ps
                '''
            }
        }

        stage('Smoke Test') {
            steps {

                sh '''
                    echo "Waiting for application to start..."

                    sleep 5

                    echo "Running health check..."

                    curl --fail \
                        http://localhost:${APP_PORT}/health

                    echo ""
                    echo "Smoke test passed successfully!"
                '''
            }
        }
    }

    post {

        success {
            echo '''
==========================================
 Jenkins Pipeline Completed Successfully
==========================================
            '''
        }

        failure {
            echo '''
==========================================
 Jenkins Pipeline Failed
==========================================
            '''
        }

        always {
            echo "Build Number: ${BUILD_NUMBER}"
            echo "Image Tag: ${IMAGE_TAG}"
        }
    }
}
